const router = require('express').Router();
const passport = require('passport');
const User = require('../models/users-model');
const passportSetup = require('../config/users-passport'); 
const {check, validationResult} = require('express-validator/check');

router.get('/', (req, res) => {
	if (req.user) {
		res.render('home', {username: req.user.username});
	}else {
		res.render('home');
	}
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// Login Handler
router.post('/login', 
	passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),
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
	res.render('register');
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

	// Save the user
	let newUser = {
		username: req.body.username,
		email: req.body.email,
		password: req.body.pass1
	}

	User.saveUser(newUser, () => {
		console.log(`New user was saved`);
	});
	res.json(req.body);
});

router.get('/profile', (req, res) => {
	if (req.user) {
		res.render('profile', {username: req.user.username});
	}else {
		res.redirect('/')
	}
});

module.exports = router;