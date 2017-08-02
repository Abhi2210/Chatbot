'use strict';

const service 		= require('../server/service');
const http 			= require('http');
const server 		= http.createServer(service);


const RtmClient			= require('@slack/client').RtmClient;
const CLIENT_EVENTS 	= require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS 		= require('@slack/client').RTM_EVENTS;
const serviceRegistry   = service.get('serviceRegistry');



var bot_token = 'Slack-bot key';
var wit_token = 'Wit.ai api key';
const witClient 	= require('../server/witClient');

var nlp = witClient(wit_token);
var rtm = new RtmClient(bot_token);
let channel;
var	registry = serviceRegistry;


server.listen(3000)
server.on('listening',function(){
		console.log("Lumos is listening on %d in %s  mode.",server.address().port,service.get('env'));
});

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  for (const c of rtmStartData.channels) {
	  if (c.is_member && c.name ==='general') { channel = c.id }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

function handleOnMessage(message){

	if(message.text.toLowerCase().includes('lumos')){
		console.log("message accepted");
		nlp.ask(message.text,(err,res)=>{
			if(err){
				console.log(" inside error *************************************************")
				console.log(err);
				return;
			}
			console.log(" ************outside error *************************************************")

			try{
				if(!res.intent || !res.intent[0] || !res.intent[0].value){
					throw new Error("Intent not Extracted");
				}
				console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
				console.log(res.intent[0].value);
				const intent = require('./intent/'+ res.intent[0].value + 'intent');
				console.log("intent");
				intent.process(res, registry, function(error,response){
					if(error){
						console.log(error.message);
						return;
					}
					return rtm.sendMessage(response,message.channel);
				})
			} 

			catch(err){

				console.log(err);
				console.log(res);
				console.log("error");
				rtm.sendMessage("Sorry, I don't know what you are talking about", message.channel);
			}

/**
			if(!res.intent){
				return rtm.sendMessage("Finally",message.channel);
			}
			else if(res.intent[0].value=='time' && res.location){
				console.log("${res.location.value}");
				console.log(res.location[0].value);
				return	rtm.sendMessage(`Finally,its working ${res.location[0].value}`,message.channel);
			}

			else {
				console.log(res);
				return	rtm.sendMessage("Sorry,its not working ",message.channel);
			}
*/

		});
	}
}

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
	rtm.sendMessage("Hello!", channel);
  	rtm.on(RTM_EVENTS.MESSAGE,handleOnMessage);

});


rtm.start();