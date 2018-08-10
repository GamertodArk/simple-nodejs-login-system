const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const mongooose = require('mongoose');
const Schema = mongooose.Schema;

mongooose.connect(keys.mongoDB.connectURI,{useNewUrlParser: true}).then(() => {
	console.log('Connected to database');
});

let userSchema = new Schema({
	username: String,
	email: String,
	password: String
});

const User = module.exports = mongooose.model('user', userSchema);

module.exports.saveUser = ((newUser, callback) => {
	bcrypt.genSalt(10,(err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			newUser.password = hash;
			new User(newUser).save().then(callback());
		});
	});
});

module.exports.findUserByUsername = (username, callback) => {
	User.findOne({username: username}, (err, user) => {
		callback(err, user);
	});
}

module.exports.comparePasswords = (password, hash, callback) => {
	bcrypt.compare(password, hash, (err, isMatch) => {
		callback(err, isMatch);
	});	
}

module.exports.findUserById = (id, callback) => {
	User.findById({_id: id}, (err, user) => {
		callback(err, user);
	});
}

module.exports.checkIfExits = (username, email, callback) => {
	User.find({$or:[{username: username}, {email: email}]},(err, docs) => {
		if (err) {
			console.log(err);
			callback(false);
		}
		if (docs.length >= 1) {
			callback(true);
		}else {
			callback(false);
		}

	});
}