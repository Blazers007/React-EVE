// 第三方
var router 		= require('express').Router();
var async 		= require('async');
var request 	= require('request');
var xml2js 		= require('xml2js');
var _ 			= require('underscore');
// 数据库
var db 			= require('../../server').db;
var Favorite 	= require('../../models/favorite');


/**
 * GET /api/users/{userId}/favorite
 * 返回指定的userId的Favorite JSON 结构
 */
router.get('/api/users/:userId/favorite', function(req, res, next) {
	Favorite.find()
		.where('userId', req.params.userId)
		.exec(function(err, favorites) {
			if (err) return next(err);

			if (favorites) {
				console.log(favorites);
				res.end(JSON.stringify(favorites[0].favorite));
			}else{
				res.end('404');
			}
		});
});

/**
 * GET /api/users/{userId}/favorite/jokes
 * 返回指定的userId的Jokes JSONArray 结构
 */
router.get('/api/users/:userId/favorite/jokes', function(req, res, next) {
	Favorite.find()
		.where('userId', req.body.userId)
		.exec(function(err, favorite) {
			if (err) return next(err);

			if (favorite) {
				console.log(favorite);
				res.end(JSON.stringify(favorite));
			}
		});
});


/**
* PUT /api/users/{userID}/favorite
* 更新该用户的Favorite数据
*/
router.put('/api/users/:userId/favorite', function(req, res, next) {
	// 没有用户首先创建用户 有用户则直接添加
	var news = [], images = [], jokes = [];
	for (var i = 0 ; i < 10 ; i ++ ) {
		news.push({
			id:1233314,
			favTime:1231131231233
		});
		images.push({
			url:"http://1111.jpg",
			favTime:1231131231233
		});
		jokes.push({
			comment_ID:1233314,
			favTime:1231131231233
		});
	};
	var fav = new Favorite({
		userId:"bqvSgbP6G",
		favorite:{
			news:news,
			images:images,
			jokes:jokes
		},
		update:new Date()
	});
	fav.save(function(err, doc) {
		if (err) return console.log(err);
		console.log(doc);
	});
});

module.exports = router;