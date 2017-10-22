# sqlcachedb

Using SQLite database for a persistant object cache. This packaged is designed to easily store large amounts of data directly into a SQLite3 database for retrival at a later date. It's not as fast as using memory based storage or file based storage.


# Usage


```javascript
var cache = require('sqlcachedb');

cache.setCache('url','https://github.com', function(){

	cache.getCache('url', function(err,data){
		console.log(data);
	});

});

cache.getCache('url', function(err,data){
	console.log(data);
});
```

**Note:** This package is in Alpha stages, probably should not have been published to the repository in it's current state.

caveat emptor

[![NPM](https://nodei.co/npm/sqlcachedb.png?downloads=true&downloadRank=true)](https://nodei.co/npm/sqlcachedb/)
