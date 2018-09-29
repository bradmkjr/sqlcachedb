var cache = require('sqlcachedb');

cache.setCache('test', Math.random(), function(){});

cache.setCache('test2', Math.random(), function(){});

cache.setCache('test3', Math.random(), function(){});

cache.setCache('url','https://github.com', function(){

	cache.getCache('url', function(err,data){
		// eslint-disable-next-line no-console
		console.log(data);
	});

	cache.getCache('test3', function(err,data){
		// eslint-disable-next-line no-console
		console.log(data);
	});

});

cache.getCache('url', function(err,data){
	// eslint-disable-next-line no-console
	console.log(data);
});


cache.getKeys(function(err, keys){
	// eslint-disable-next-line no-console
	console.log(keys);
});


cache.getActiveKeys(function(err, keys){
	// eslint-disable-next-line no-console
	console.log(keys);
});

cache.cleanCache(function(){
	cache.getKeys(function(err, keys){
		// eslint-disable-next-line no-console
		console.log(keys);
	});

});

cache.purgeCache(function(){
	cache.getKeys(function(err, keys){
		// eslint-disable-next-line no-console
		console.log(keys);
	});

});