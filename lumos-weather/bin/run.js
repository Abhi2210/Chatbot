"use strict";

const request 		=  require('superagent');
const service 		= require('../server/service');
const http 			= require('http');

const server 		= http.createServer(service);

server.listen();

server.on('listening',function(){
		console.log("Lumos-weather is listening on %d in %s  mode.",server.address().port,service.get('env'));
		const announce = () => {
			request.put(`http://127.0.0.1:3000/service/weather/${server.address().port}`, (err,res)=>{
				if(err){
					console.log(err);
					console.log('error connecting to lumos');
					return;

				}
				console.log(res.body);
			});
		};
		announce();
		setInterval(announce,15*1000);
});
