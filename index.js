/*!
 * SQLCacheDB
 *
 * Copyright(c) 2018 Bradford Knowlton
 * MIT Licensed
 *
 * Version 1.2.1
 */

'use strict';

var sqlite3 = require('sqlite3');
var cacheDb = new sqlite3.Database( __dirname + '/data/database.db');

// default age for active cache entries
var cacheLifetime = '-6 hours';

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
* @param   {Function} callback function name for callback
*/
exports.getCache = function(key, callback){
	// query database for data based on key with date within lifetime

	cacheDb.serialize(function() {
		cacheDb.get('SELECT `key`, `data` FROM `cache` WHERE `key` == (?) AND date_updated > date("now", ?)', key, cacheLifetime, function(err,row){
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
* @param   {string} data Value to be stored in cache.
* @param   {Function} callback function name for callback
*/
exports.setCache = function(key, data, callback){

	cacheDb.serialize(function() {

		var stmt = cacheDb.prepare('INSERT OR REPLACE INTO `cache` (`ID`,`key`,`data`,`date_created`,`date_updated`) VALUES ( (SELECT `ID` FROM `cache` WHERE `key` == (?)), (?), (?), COALESCE((SELECT `date_created` FROM `cache` WHERE `key` == (?)), datetime("now") ), datetime("now") );');

		stmt.run( key, key, data, key );

		stmt.finalize();

		callback();

	});
};

/**
* purgeCache
* removes all keys from cache
*
* @param   {Function} callback function name for callback
*/
exports.purgeCache = function(callback){
	cacheDb.serialize(function() {
		cacheDb.run('DELETE FROM `cache`', function(){
			callback();
		});
	});
};

/**
* purgeKey
* removes a key from cache
*
* @param   {string} key Value for lookup in database.
* @param   {Function} callback function name for callback
*/
exports.purgeKey = function(key,callback){
	cacheDb.serialize(function() {
		cacheDb.run('DELETE FROM `cache` WHERE `key` == ?', key, function(){
			callback();
		});
	});
};

/**
* cleanCache
* removes all keys from cache which are expired
*
* @param   {Function} callback function name for callback
*/
exports.cleanCache = function(callback){
	cacheDb.serialize(function() {
		cacheDb.run('DELETE FROM `cache` WHERE date_updated < datetime("now", ?)', cacheLifetime, function(){
			callback();
		});
	});
};


/**
* getKeys
* Gets all the keys in the cache.
*
* @param   {Function} callback function name for callback
*/
exports.getKeys = function(callback){
	var keys = [];

	cacheDb.serialize(function() {
		cacheDb.all('SELECT key FROM `cache`', function(err, rows) {
			if ( err ){
				callback(err, null);
			}else{
				rows.forEach(function(row){
					keys.push(row.key);
				});
			}
			callback(err,keys);
		});
	});
};

/**
* getActiveKeys
* Gets all the keys in the cache recently set.
*
* @param   {Function} callback function name for callback
*/
exports.getActiveKeys = function(callback){
	var keys = [];

	cacheDb.serialize(function() {
		cacheDb.all('SELECT key FROM `cache` WHERE date_updated > datetime("now", ?)', cacheLifetime, function(err, rows) {
			if ( err ){
				callback(err, null);
			}else{
				rows.forEach(function(row){
					keys.push(row.key);
				});
			}
			callback(err,keys);
		});
	});
};