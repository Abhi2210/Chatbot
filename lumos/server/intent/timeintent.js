'use strict';

const request = require('superagent');

module.exports.process = function process(intentData , registry, cb){
	console.log("inside timeintent")
	if(intentData.intent[0].value != 'time'){
		console.log("problem");
		return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
	}
	if(!intentData.location)	return cb(new Error('Missing location in time intent'));


	const location = intentData.location[0].value.replace(/(,. )?lumos/i,'');
	const service  = registry.get('time');

	if(!service) return cb(false,'No service available');

	console.log("the passed value is")
	console.log(`${location}`);
	console.log(`http://${service.ip}:${service.port}/service/${location}`);

	request.get(`http://${service.ip}:${service.port}/service/${location}`,(err,res)=>{
		console.log("getting time")
		if( err || res.statusCode!=200 || !res.body.result){
			console.log("err");
			console.log(err);
			console.log("problem");
			return cb(false,`I had problem finding out the time in ${location}`);

		}
		console.log(`The time in ${location} is ${res.body.result}`);
		return cb(false,`The time in ${location} is ${res.body.result}`);

	});
}