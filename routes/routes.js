const router = require('express').Router();
const passport = require('passport');
const User = require('../models/users-model');
const passportSetup = require('../config/users-passport'); 
const {check, validationResult} = require('express-validator/check');

router.get('/', (req, res) => {
	res.render('home', {username: req.user, success: req.flash('success')});
});

router.get('/login', (req, res) => {
	res.render('login', {loginFailure: req.flash('error')[0]});
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// Login Handler
router.post('/login', 
	passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid username or password'}),
	(req, res) => {

		// Validations
		req.checkBody('username', 'You must enter an Username').not().isEmpty();
		req.checkBody('password', 'You must entern a Password').not().isEmpty();

		let errors = req.validationErrors();
		if (errors) {
			res.render('login', {errors: errors});
			return;
		}

		res.redirect('/profile');
});

router.get('/register', (req, res) => {
	res.render('register', {msg: req.flash('user_exits')});
});

// Register Handler
router.post('/register',(req, res) => {

		// Check all values before saving them
		req.checkBody('username', 'Username Is required').not().isEmpty();
		req.checkBody('username', 'Username is too short').isLength({min: 5});
		req.checkBody('username', 'Username us too long').isLength({max: 20});

		req.checkBody('email', 'Your email is invalid').isEmail();

		req.checkBody('pass1', 'A password is required').not().isEmpty();
		req.checkBody('pass1', 'Password is too short').isLength({min: 8});

		req.checkBody('pass2', 'Repeat your password').not().isEmpty();
		req.checkBody('pass2', 'Passwords do not match').equals(req.body.pass1);

		// Error Handler
		let errors = req.validationErrors();
		if (errors) {
			res.render('register', {errors: errors});
			return;
		}

		// Check if the user already exits
		User.checkIfExits(req.body.username, req.body.email, (isMatch) => {

			if (isMatch) {
				// User exits
				req.flash('user_exits', "The credencial you're entering are already in used, try changing the username or email");
				res.redirect('/register');
				return;
			}else {
				// Save the user
				let newUser = {
					username: req.body.username,
					email: req.body.email,
					password: req.body.pass1
				}

				User.saveUser(newUser, () => {
					console.log(`New user was saved`);
				});

				req.flash('success', 'You are successfully registered and new can log in');
				res.redirect('/');
			}
		});
});

router.get('/profile', (req, res) => {
	if (req.user) {
		res.render('profile', {username: req.user});
	}else {
		res.redirect('/')
	}
});

module.exports = router;