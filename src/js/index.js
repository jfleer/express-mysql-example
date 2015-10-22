/*************************************************
* Index.js
*
* Created by J. Fleer
*
* Inspired By: 
* 	https://www.codementor.io/nodejs/tutorial/
*		node-js-mysql
*************************************************/

// Dependencies
var express		= require("../../node_modules/express");
var mysql		= require('../../node_modules/mysql');
var app			= express();

// Create pool for concurrent connections to db
var pool 		= mysql.createPool({
	connectionLimit : 100, //important
	host     : 'localhost',
	user     : '',
	password : '',
	database : 'test_database',
	debug    :  false
});

function handle_database(request, response) {

	// Gets a connection to database
	pool.getConnection(function(err, connection) {
		if (err) {
			connection.release();
			response.json({"code" : 100, "status" : "Error in database connection"});
			return;
		}   
		
		// Log id to console
		console.log('Connected with id ' + connection.threadId);

		// Database query
		connection.query("select * from user", function(err, rows) {
			connection.release();
			
			if(!err) {
				response.json(rows);
			}           
		});

		// If error in connection
		connection.on('error', function(err) {      
			response.json({"code" : 100, "status" : "Error in database connection"});
			return;     
		});
	});
}

app.get("/",function(request,response) {
	handle_database(request,response);
});

app.listen(65000);
