'use strict';

const request = require('superagent');

module.exports.process = function process(intentData , registry, cb){
	console.log("inside weatherintent")
	if(intentData.intent[0].value != 'weather'){
		console.log("problem");
		return cb(new Error(`Expected weather intent, got ${intentData.intent[0].value}`));
	}
	if(!intentData.location)	return cb(new Error('Missing location in weather intent'));

	const location = intentData.location[0].value;
	console.log(`${location}`);
	const service  = registry.get('weather');

	if(!service) return cb(false,'No service available');

	console.log("the passed value is")
	console.log(`${location}`);
	console.log(`http://${service.ip}:${service.port}/service/${location}`);

	request.get(`http://${service.ip}:${service.port}/service/${location}`,(err,res)=>{
		console.log("getting weather")
		if( err || res.statusCode!=200 || !res.body.result){
			console.log("err");
			console.log(err);
			console.log("problem");
			return cb(false,`I had problem finding out the weather in ${location}`);

		}
		console.log(`The weather in ${location} is ${res.body.result}`);
		return cb(false,`The weather in ${location} is ${res.body.result}`);

	});
}