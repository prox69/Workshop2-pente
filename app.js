/********************** SCRIPT SERVEUR ***************************/

/******** DEPENDENCIES **********/
var express = require("express");
var http = require("http");
var async = require("async");
var underscore = require("underscore");
var bodyParser = require("body-parser");
var jsonwebtoken = require("jsonwebtoken");
var api = require('./include/api');

/*********** EXPRESS *************/
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/*********** LANCEMENT DE L'API *************/
var mods = {
	app : app,
	jwt: jsonwebtoken,
	async : async,
	_ : underscore
};
api.load(mods);


/********LANCEMENT**********/
//Lancement du serveur
var server_port = 80;
var server_ip_address = '127.0.0.1';

app.listen(server_port, server_ip_address, function(){
	console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});

