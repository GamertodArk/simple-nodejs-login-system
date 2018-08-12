# Simple nodeJS login system
This time I created a login system using nodeJS and mongoDB, I did it because I wanted to learn how to use sessions and cookies with nodeJS. It's not a complicated login system, but for being a beginners test, I think it's good enough

## Installation 

First open git Bash and run this command
```bash
git clone git@github.com:GamertodArk/simple-nodejs-login-system.git
```
Now, go to the folder git just created and run this command
```bash
npm install 
```

And now, this repository needs a new file to run, go to
```
<repository folder>/config
```
You need to create a new file called `keys.js`

Once you crate that file, copy and paste the following code

```javascript
module.exports = {
	mongoDB: {
		connectURI: 'mongodb connect string'
	},
	cookies: {
		secret: 'cookie secret key'
	} 
}
```

The `keys.js` file stores some configuration string for our app.

`connectURI` stores the string which mongoose is going to use to connect to the database and `secret` stores the cokkies secret key

Change the `keys.js` file with your own data and finally run the app

```bash
node app.js
```