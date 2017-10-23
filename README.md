# sqlcachedb

Using SQLite database for a persistant object cache. This packaged is designed to easily store large amounts of data directly into a SQLite3 database for retrival at a later date. It's not as fast as using memory based storage or file based storage.


# Usage

Current default cache lifetime is 6 hours, future versions will allow this to be modified.

```javascript
var cache = require('sqlcachedb');

cache.setCache('test', Math.random(), function(){});

cache.setCache('test2', Math.random(), function(){});

cache.setCache('test3', Math.random(), function(){});

cache.setCache('url','https://github.com', function(){

	cache.getCache('url', function(err,data){
		console.log(data);
	});
	
	cache.getCache('test3', function(err,data){
		console.log(data);
	});

});

cache.getCache('url', function(err,data){
	console.log(data);
});


cache.getKeys(function(err, keys){
	console.log(keys);
})


cache.getActiveKeys(function(err, keys){
	console.log(keys);
})

cache.cleanCache(function(){
	cache.getKeys(function(err, keys){
		console.log(keys);
	})

})

cache.purgeCache(function(){
	cache.getKeys(function(err, keys){
		console.log(keys);
	})

})
```

**Note:** This package is in Alpha stages, probably should not have been published to the repository in it's current state.

caveat emptor

[![NPM](https://nodei.co/npm/sqlcachedb.png?downloads=true&downloadRank=true)](https://nodei.co/npm/sqlcachedb/)
