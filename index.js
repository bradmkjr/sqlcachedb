/*!
 * SQLCacheDB 
 *
 * Copyright(c) 2017 Bradford Knowlton
 * MIT Licensed
 *
 * Version 1.0.1
 */

'use strict'

var sqlite3 = require('sqlite3');
var cacheDb = new sqlite3.Database('./data/database.db');

function getCache(key){

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

function putCache(key, data){

	cacheDb.serialize(function() { 
		
		var stmt = cacheDb.prepare("INSERT OR REPLACE INTO `cache`(`ID`,`key`,`data`,`date_created`) VALUES ( NULL, (?), (?), datetime('now') );");

		stmt.run( key, data );
        
      	stmt.finalize();

	});

	cacheDb.close();
}