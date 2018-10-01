/*###############################################################################
#
# EOS Mongo History API
# API to get actions using EOS mongo plugin (similar to history plugin)
#
# Examples:
# http://history.cryptolions.io:3838/v1/get_actions/cryptolions1
# http://history.cryptolions.io:3838/v1/get_actions/cryptolions1/sethash
# http://history.cryptolions.io:3838/v1/get_actions/cryptolions1/sethash?limit=2&skip=1&sort=-1
#
# Git Hub: https://github.com/CryptoLions/EOS-mongo-history-API
#
# Created by http://CryptoLions.io
#
###############################################################################  */


//var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var app = express();
var http = require('http').Server(app);

var CONFIG = require('./config.js');

app.use('/', express.static(__dirname + '/html'));


var MongoClient = require('mongodb').MongoClient;
MongoClient.connect( CONFIG.mongoURL, function(err, db) {

        console.log("Database Connected!");
        var dbo = db.db(CONFIG.mongoDB);

        app.get('/v1/get_actions/:account', function(req, res){

	    var limit = 10;
	    if (req.query.limit*1 > 0 )
		limit = req.query.limit*1;

	    var skip = 0;
	    if (req.query.skip*1 > 0 )
		skip = req.query.skip*1;
	    if (req.query.skip*1 > 0 )
		skip = req.query.skip*1;

	    var sort = -1;
	    if (req.query.sort*1 > 0 )
		sort = 1;


	    dbo.collection("action_traces").find( {$or: [
				{"act.account": req.params.account}, 
				{"act.data.receiver": req.params.account}, 
				{"act.data.from": req.params.account}, 
				{"act.data.to": req.params.account},
				{"act.data.name": req.params.account},
				{"act.data.voter": req.params.account},
				{"act.authorization.actor": req.params.account}
			]}).sort({"_id": sort}).skip(skip).limit(limit).toArray(function(err, result) {

		if (err) throw err;

		//console.log(result);
		res.json(result);
	    });
	    
        });


        app.get('/v1/get_actions/:account/:action', function(req, res){
	    var limit = 10;
	    if (req.query.limit*1 > 0 )
		limit = req.query.limit*1;

	    var skip = 0;
	    if (req.query.skip*1 > 0 )
		skip = req.query.skip*1;
	    if (req.query.skip*1 > 0 )
		skip = req.query.skip*1;

	    var sort = -1;
	    if (req.query.sort*1 > 0 )
		sort = 1;
	    
	    dbo.collection("action_traces").find( {"act.name": req.params.action,  $or: [
				{"act.account": req.params.account}, 
				{"act.data.receiver": req.params.account}, 
				{"act.data.from": req.params.account}, 
				{"act.data.to": req.params.account},
				{"act.data.name": req.params.account},
				{"act.data.voter": req.params.account},
				{"act.authorization.actor": req.params.account}
			]}).sort({"_id":sort}).skip(skip).limit(limit).toArray(function(err, result) {

		if (err) throw err;

		//console.log(result);
		res.json(result);
	    });
	    
        });


});


http.listen(CONFIG.serverPort, function(){
  console.log('listening on *:'+CONFIG.serverPort);
});
