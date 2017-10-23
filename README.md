# sqlcachedb

Using SQLite database for a persistant object cache. This packaged is designed to easily store large amounts of data directly into a SQLite3 database for retrival at a later date. It's not as fast as using memory based storage or file based storage.

# Installation

npm install sqlcachedb --save

# Usage

Current default cache lifetime is 6 hours, future versions will allow this to be modified.


## Basic Example
```javascript
var cache = require('sqlcachedb');

cache.setCache('url','https://github.com', function(){

	cache.getCache('url', function(err,data){
		console.log(data);
	});

});
```

## setCache
Store a value into cache based on a key
```javascript
var cache = require('sqlcachedb');

cache.setCache('test', Math.random(), function(){});

cache.setCache('test2', Math.random(), function(){});

cache.setCache('test3', Math.random(), function(){});
```

## getCache
Retrieve a value from cache based on a key
```javascript
var cache = require('sqlcachedb');

cache.setCache('url','https://github.com', function(){

	cache.getCache('url', function(err,data){
		console.log(data);
	});

});
```


## getKeys
Gets all the keys from cache
```javascript
var cache = require('sqlcachedb');

cache.setCache('test', Math.random(), function(){});

cache.setCache('test2', Math.random(), function(){});

cache.setCache('test3', Math.random(), function(){});

cache.getKeys(function(err, keys){
	console.log(keys);
})
```

## getActiveKeys
Gets all the keys from cache updated within cache lifetime
```javascript
var cache = require('sqlcachedb');

cache.setCache('test', Math.random(), function(){});

cache.setCache('test2', Math.random(), function(){});

cache.setCache('test3', Math.random(), function(){});

cache.getActiveKeys(function(err, keys){
	console.log(keys);
});
```

## purgeKey
Remove data from cache based on key
```javascript
var cache = require('sqlcachedb');

cache.setCache('test4', 'Houdini', function(){

	cache.getCache('test4',function(err, data){
		console.log('test4: '+data);
		
		cache.purgeKey('test4', function(err){

			cache.getCache('test4',function(err, data){
				console.log('test4: '+data);
			});
		});	
	});	
});
```

## purgeCache
```javascript
Remove all data from cache
var cache = require('sqlcachedb');

cache.purgeCache(function(){
	cache.getKeys(function(err, keys){
		console.log(keys);
	});
});
```

## cleanCache
Remove all data from cache which has expired
```javascript
var cache = require('sqlcachedb');

cache.cleanCache(function(){
	cache.getKeys(function(err, keys){
		console.log(keys);
	});
});
```




**Note:** This package is in Alpha stages, probably should not have been published to the repository in it's current state.

caveat emptor

[![NPM](https://nodei.co/npm/sqlcachedb.png?downloads=true&downloadRank=true)](https://nodei.co/npm/sqlcachedb/)
