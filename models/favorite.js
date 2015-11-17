var mongoose = require('mongoose');

var favoriteSchema = new mongoose.Schema({
	userId: {type: String, unique: true, index: true},
	favorite:{
		news:[{
			id: Number,
			favTime: Number
		}],
		images:[{
			url: String,
			favTime: Number
		}],
		jokes:[{
			comment_ID: Number,
			favTime: Number
		}]
	},
	update: Date
});

module.exports = mongoose.model('Favorite', favoriteSchema);