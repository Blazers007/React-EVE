'use strict';

var _ = require('underscore')

var payload = {
	name : 'payload',
	type : 'Object',
	children : {
		name : 'child1',
		gender : 'male'
	}
}

var data = {
	characterId : 15,
	type : 'Character'
}

_.assign(payload, data);  // 合并并覆盖

console.log(payload);


var list = [1,2,3,4,5,6,7,8];
var list2 = _.reduce(list, function(memo, num){
	console.log('Sum ->' + memo + '  Now ->' + num);
	return memo + num;
}, 0);

console.log(list2);