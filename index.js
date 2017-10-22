/*!
 * SQLCacheDB 
 *
 * Copyright(c) 2017 Bradford Knowlton
 * MIT Licensed
 *
 * Version 1.0.3
 */

'use strict'

var sqlite3 = require('sqlite3');
var cacheDb = new sqlite3.Database('./data/database.db');

exports.sqlCacheDb = function(){

	cacheDb.serialize(function() {
	  cacheDb.run('CREATE TABLE "cache" (
		`ID`	INTEGER PRIMARY KEY AUTOINCREMENT,
		`key`	TEXT UNIQUE,
		`data`	TEXT,
		`date_created`	TEXT,
		`date_updated`	TEXT
	);');
	 
	});
	 
	cacheDb.close();

}

exports.getCache = function(key){

	var query = cacheDb.prepare("SELECT * FROM `cache` WHERE `key` = '(?)'", key);

	cacheDb.get(query, function(err, row) {

		if ( err || row == undefined ){
			// cache miss
			console.log('Cache MISS'); 
			
			return null;
		}else{
			// cache hit
			console.log('Cache HIT');

			var data = row.data;

			return data;
		}

	});

	cacheDb.close();

}

exports.putCache = function(key, data){

	cacheDb.serialize(function() { 
		
		var stmt = cacheDb.prepare("INSERT OR REPLACE INTO `cache`(`ID`,`key`,`data`,`date_created`) VALUES ( NULL, (?), (?), datetime('now') );");

		stmt.run( key, data );
        
      	stmt.finalize();

	});

	cacheDb.close();
}

exports.purgeCache = function(key, data){

	cacheDb.serialize(function() { 
		
		var stmt = cacheDb.prepare("");

		stmt.run( key, data );
        
      	stmt.finalize();

	});

	cacheDb.close();
}