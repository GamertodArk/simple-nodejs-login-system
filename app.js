const path = require('path');
const express = require('express');
const passport = require('passport');
const keys = require('./config/keys');
const flash = require('connect-flash');
const routes = require('./routes/routes');
const User = require('./models/users-model');
const cookieSession = require('cookie-session');
const expressValidator = require('express-validator');

const app = express();

// View engine
app.set('view engine', 'pug');

app.use(expressValidator());

app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,
	keys: [keys.cookies.secret]
}));

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
})