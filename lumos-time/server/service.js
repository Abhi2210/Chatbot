"use strict";

const express = require('express');
const service = express();
const request = require("superagent");
const moment  = require('moment');



service.get('/service/:location',(req,res,next)=>{
		console.log(req.params.location);
		request.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ req.params.location+'&key=Your_key',(err,response)=>{
			console.log("inside api");
			if(err){
				console.log(err);
				return res.sendStatus(404);
			}
			
			console.log(response.body.results[0]);

			const location =  response.body.results[0].geometry.location ;

			const timestamp = +moment().format('X');	// +=>integer back at the end X => Unix timestamp
			//res.json({result: req.params.location});

			request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&Your_key',(err,response)=>{
				if(err){
					console.log(err);
					return res.sendStatus(404);
				}
				const result= response.body;

				console.log(response.body);
				const timeString= moment.unix(timestamp + result.dstOffset+ result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');
			
				res.json({result:timeString});



			});

			
		});
});
module.exports = service;
 