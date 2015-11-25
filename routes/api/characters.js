// 第三方
var router 		= require('express').Router();
var async 		= require('async');
var request 	= require('request');
var xml2js 		= require('xml2js');
var _ 			= require('underscore');
// 数据库
var db 			= require('../../server').db;
var Character 	= require('../../models/character');

/**
 * POST /api/characters
 * Adds new character to the database.
 */
router.post('/api/characters', function(req, res, next) {

    var gender = req.body.gender;
    var characterName = req.body.name;
    var characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;

    var parser = new xml2js.Parser();

    async.waterfall([
        // 根据角色Name查询角色ID
        function(callback) {
            request.get(characterIdLookupUrl, function(err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function(err, parsedXml) {
                    if (err) return next(err);
                    try {
                        var characterId = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;

                        Character.findOne({ characterId: characterId }, function(err, character) {
                            if (err) return next(err);

                            if (character) {
                                return res.status(409).send({ message: character.name + ' is already in the database.' });
                            }

                            callback(err, characterId);
                        });
                    } catch (e) {
                        return res.status(400).send({ message: 'XML Parse Error' });
                    }
                });
            });
        },

        // 根据角色ID查询角色属性
        function(characterId) {
            var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;

            // 请求EVE 服务器查询角色信息
            request.get({ url: characterInfoUrl }, function(err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function(err, parsedXml) {
                    if (err) return res.send(err);
                    try {
                        var name = parsedXml.eveapi.result[0].characterName[0];
                        var race = parsedXml.eveapi.result[0].race[0];
                        var bloodline = parsedXml.eveapi.result[0].bloodline[0];

                        var character = new Character({
                            characterId: characterId,
                            name: name,
                            race: race,
                            bloodline: bloodline,
                            gender: gender,
                            random: [Math.random(), 0]
                        });

                        // 写输数据库
                        character.save(function(err) {
                            if (err) return next(err);
                            res.send({ message: characterName + ' has been added successfully!' });
                        });
                    } catch (e) {
                        res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
                    }
                });
            });
        }
    ]);
});

/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
router.get('/api/characters', function(req, res, next) {
    var choices = ['Female', 'Male'];
    var randomGender = _.sample(choices);     // 随机取出一种性别

    // 随机查询
    Character.find({ random: { $near: [Math.random(), 0] } })
        .where('voted', false)
        .where('gender', randomGender)
        .limit(2)
        .exec(function(err, characters) {
            if (err) return next(err);

            if (characters.length === 2) {
                return res.send(characters);
            }

            var oppositeGender = _.first(_.without(choices, randomGender));

            Character
                .find({ random: { $near: [Math.random(), 0] } })
                .where('voted', false)
                .where('gender', oppositeGender)
                .limit(2)
                .exec(function(err, characters) {
                    if (err) return next(err);

                    if (characters.length === 2) {
                        return res.send(characters);
                    }

                    Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
                        if (err) return next(err);
                        res.send([]);
                    });
                });
        });
});

/**
 * PUT /api/characters
 * Update winning and losing count for both characters.
 */
router.put('/api/characters', function(req, res, next) {
    var winner = req.body.winner;
    var loser = req.body.loser;

    if (!winner || !loser) {
        return res.status(400).send({ message: 'Voting requires two characters.' });
    }

    if (winner === loser) {
        return res.status(400).send({ message: 'Cannot vote for and against the same character.' });
    }

    // 同步进行 比如 Observable.zip
    async.parallel([
            function(callback) {
                Character.findOne({ characterId: winner }, function(err, winner) {
                    callback(err, winner);
                });
            },
            function(callback) {
                Character.findOne({ characterId: loser }, function(err, loser) {
                    callback(err, loser);
                });
            }
        ],
        // 第一个参数中全部cb执行完毕时执行该回调 results 是由于前面的参数为数组形式 否则则为多参数形式
        function(err, results) {
            if (err) return next(err);

            var winner = results[0];
            var loser = results[1];

            if (!winner || !loser) {
                return res.status(404).send({ message: 'One of the characters no longer exists.' });
            }

            if (winner.voted || loser.voted) {
                return res.status(200).end();
            }

            async.parallel([
                function(callback) {
                    winner.wins++;
                    winner.voted = true;
                    winner.random = [Math.random(), 0];
                    winner.save(function(err) {
                        callback(err);
                    });
                },
                function(callback) {
                    loser.losses++;
                    loser.voted = true;
                    loser.random = [Math.random(), 0];
                    loser.save(function(err) {
                        callback(err);
                    });
                }
            ], function(err) {
                if (err) return next(err);
                res.status(200).end();
            });
        });
});


/*
* GET /api/characters/count
* 返回当前数据库中Character Collection的Document的数量
* */
router.get('/api/characters/count', function(req, res, next) {
    Character.count({}, function(err, count) {
       if (err) return next(err);
        res.send({count: count});
    });
});

/**
 * GET /api/characters/search
 * 根据名称查询数据库
 * */
router.get('/api/characters/search', function(req, res, next) {
   var characterName = new RegExp(req.query.name, 'i'); // 大小写不敏感 转换大小写用
    Character.findOne({name: characterName}, function(err, character) {
        if (err) return next(err);
        if (!character) {
            return res.status(404).send({message: 'Character not found'});
        }
        res.send(character);
    })
});


/**
 * GET /api/characters/top
 * 根据条件查询TOP
 * */
router.get('/api/characters/top', function(req, res, next) {
    // 将条件重新组合为带有正则表达式的RegObject
    var params = req.query;
    var conditions = {};
    _.each(params, function(value, key) {
        conditions[key] = new RegExp('^' + value + '$', 'i'); // https://docs.mongodb.org/manual/reference/operator/query/regex/  i -> 大小写不敏感
    });
    Character
        .find(conditions)
        .sort('-wins') //
        .limit(100)
        .exec(function(err, characters) {
            if (err) return next(err);
            // 根据胜率排名
            characters.sort(function(a, b) {
                if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) return 1;
                if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) return -1;
                return 0;
            });
            res.send(characters);
        });
});

/**
 * GET /api/characters/shame
 * 返回Lose数量最多的
 * */
router.get('/api/characters/shame', function(req, res, next) {
    Character
        .find({})
        .sort('loses')
        .limit(100)
        .exec(function(err, characters) {
            if (err) return next(err);
            res.send(characters);
        })
});

/**
 * GET /api/characters/:id
 * 顺序上在最后 避免阻挡了api/characters的相应？
 * */
router.get('/api/characters/:id', function(req, res, next) {
    var id = req.params.id;
    Character.findOne({characterId: id}, function(err, character) {
        if (err) return next(err);
        if (!character) {
            return res.status(404).send({message: 'Character not found!'});
        }
        res.send(character);
    })
});


/**
 * POST /api/report
 * 报告该角色出现问题 如果出现4次则删除该角色
 * */
router.post('/api/report', function(req, res, next) {
    var characterId = req.body.characterId; // Form形式
    Character.findOne({characterId: characterId}, function(err, character) {
        if (err) return next(err);
        if (!character) {
            return res.status(404).send({message: 'Character not found!'});
        }
        character.reports ++;
        if (character.reports > 4) {
            character.remove();
            return res.send({message: character.name + ' has been deleted.'});
        }
        character.save(function(err) {
            if (err) return next(err);
            res.send({message: character.characterId + ' has been reported.'});
        })
    })
});

/**
 * GET /api/stats
 * 统计各种族  -> 利用async.each精简
 * */
router.get('/api/stats', function(req, res, next) {
    // Conditions
    var conditions = [
        {race: 'Amarr'},
        {race: 'Caldari'},
        {race: 'Gallente'},
        {race: 'Minmatar'},
        {gender: 'Male'},
        {gender: 'Female'}
        //Total Votes
        //LeadingRace
        //LeadingBloodLine
    ];
    async.map(conditions, function(condition, cb){
        Character.count(condition, function(err, count) {
            cb(err, count);
        });
    }, function(err, results) {
        if (err) return next(err);
        console.log(results);
    })
});

module.exports = router;