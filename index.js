/*!
 * SQLCacheDB 
 *
 * Copyright(c) 2017 Bradford Knowlton
 * MIT Licensed
 *
 * Version 1.0.6
 */

'use strict';

var sqlite3 = require('sqlite3');
var cacheDb = new sqlite3.Database('./data/database.db');

// var cacheLifetime = '-6 hours';

exports.sqlCacheDb = function(){
	// Create the database table if it doesn't exist
	cacheDb.serialize(function() {
		cacheDb.run('CREATE TABLE "cache" ( `ID` INTEGER PRIMARY KEY AUTOINCREMENT, `key` TEXT UNIQUE, `data` TEXT, `date_created` TEXT, `date_updated` TEXT	);');	 
	});

	cacheDb.close();

};

exports.getCache = function(key){
	// query database for data based on key with date within lifetime
	var query = cacheDb.prepare('SELECT * FROM `cache` WHERE `key` = "(?)"', key);

	cacheDb.get(query, function(err, row) {

		if ( err || row == undefined ){
			// cache miss
			
			return null;
		}else{
			// cache hit
			var data = row.data;

			return data;
		}
	});
	cacheDb.close();
};

exports.getKeys = function(){
	// query database for all keys
	var query = cacheDb.prepare('SELECT keys FROM `cache`');

	var keys = [];

	cacheDb.each(query, function(err, row) {
		if ( err || row == undefined ){			
			return null;
		}else{
			keys.push(row.key);
		}
	});
	cacheDb.close();

	return keys;
};

exports.getActiveKeys = function(){
	// query database for all active keys
	var query = cacheDb.prepare('SELECT keys FROM `cache` WHERE `date_updated` != "" ');

	var keys = [];

	cacheDb.each(query, function(err, row) {
		if ( err || row == undefined ){			
			return null;
		}else{
			keys.push(row.key);
		}
	});
	cacheDb.close();

	return keys;
};

exports.putCache = function(key, data){

	cacheDb.serialize(function() { 
		
		var stmt = cacheDb.prepare('INSERT OR REPLACE INTO `cache`(`ID`,`key`,`data`,`date_created`) VALUES ( NULL, (?), (?), datetime("now") );');

		stmt.run( key, data );

		stmt.finalize();

	});

	cacheDb.close();
};

exports.purgeCache = function(key, data){

	cacheDb.serialize(function() { 
		
		var stmt = cacheDb.prepare('');

		stmt.run( key, data );

		stmt.finalize();

	});

	cacheDb.close();
};