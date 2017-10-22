/*!
 * SQLCacheDB 
 *
 * Copyright(c) 2017 Bradford Knowlton
 * MIT Licensed
 *
 * Version 1.1.1
 */

'use strict';

var sqlite3 = require('sqlite3');
var cacheDb = new sqlite3.Database( __dirname + '/data/database.db');

// var cacheLifetime = '-6 hours';

exports.sqlCacheDb = function(){
	// Create the database table if it doesn't exist
	cacheDb.serialize(function() {
		cacheDb.run('CREATE TABLE IF NOT EXISTS "cache" ( `ID` INTEGER PRIMARY KEY AUTOINCREMENT, `key` TEXT UNIQUE, `data` TEXT, `date_created` datetime default current_timestamp, `date_updated` datetime default current_timestamp );');	 
	});
};

/**
* getCache
* Gets the cache data based on a key.
*
* @param   {string} key Value for lookup in database.
* @param   {function} callback function name for callback
* @returns {string} data Value from database or null.
*/
exports.getCache = function(key, callback){
	// query database for data based on key with date within lifetime
	
	cacheDb.serialize(function() {
		cacheDb.get('SELECT `key`, `data` FROM `cache` WHERE `key` == (?) AND date_updated > date("now", "-2 hours")', key, function(err,row){
			if( err || row == undefined ){
				callback(err,null);
			}else{
				callback(err,row.data);
			}
	    	
	    });
	});
};

/**
* setCache
* Sets the cache data based on a key.
*
* @param   {string} key Value for lookup in database.
* @param   {function} callback function name for callback
*/
exports.setCache = function(key, data, callback){

	cacheDb.serialize(function() { 
		
		var stmt = cacheDb.prepare('INSERT OR REPLACE INTO `cache` (`ID`,`key`,`data`,`date_created`) VALUES ( (SELECT `ID` FROM `cache` WHERE `key` == (?)), (?), (?), COALESCE((SELECT `date_created` FROM `cache` WHERE `key` == (?)), datetime("now") ) );');

		stmt.run( key, key, data, key );

		stmt.finalize();
		
		callback();

	});
};

/**
* purgeCache
* Invalidates all data in the cache.
*/
exports.purgeCache = function(){

	cacheDb.serialize(function() { 
		
		var stmt = cacheDb.prepare('');

		stmt.run( key, data );

		stmt.finalize();

	});

};


/**
* getKeys
* Gets all the keys in the cache.
*
* @returns {Array} list of keys in cache.
*/
exports.getKeys = function(){
	var keys = [];
	
	cacheDb.serialize(function() {	
		cacheDb.each("SELECT * FROM cache')", function(err, row) {
			if ( ! err && row != undefined ){			
				keys.push(row.key);
			}
		});
		
	});
	cacheDb.close();

	return keys;
};

/**
* getActiveKeys
* Gets all the keys in the cache recently set.
*
* @returns {Array} list of keys in cache.
*/
exports.getActiveKeys = function(){
	var keys = [];
	
	cacheDb.serialize(function() {	
		cacheDb.each("SELECT * FROM cache WHERE date_updated < datetime('now', '-2 hours) ", function(err, row) {
			if ( ! err && row != undefined ){			
				keys.push(row.key);
			}
		});
		
	});
	cacheDb.close();

	return keys;

};