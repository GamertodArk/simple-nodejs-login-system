const passport = require('passport');
const User = require('../models/users-model');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null,user.id);
});

passport.deserializeUser((id, done) => {
	User.findUserById(id, (err, user) => {
		done(null, user);
	});
});

passport.use(new localStrategy((username, password, done) => {
	User.findUserByUsername(username, (err, user) => {
		if (err) {done(err)}
		if (!user) {done(null, false)}

		User.comparePasswords(password, user.password, (err, isMatch) => {
			if (err) {done(err)}
			if (isMatch) {
				done(null, user);
			}else {
				done(null, false, {message: 'Invalid password'});
			}
		});
	});
}));