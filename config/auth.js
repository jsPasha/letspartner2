// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		 'clientID'      : 'your-secret-clientID-here', // your App ID
		 'clientSecret'  : 'your-client-secret-here', // your App Secret
		 'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
	},

	'googleAuth' : {
		 'clientID'      : '42102484677-c9chatf2a1s60v3mejtkmb9vjq3vsvrn.apps.googleusercontent.com',
		 'clientSecret'  : 'rIsQcHy586axZuBXC0dMwjo6',
		 'callbackURL'   : '/action/auth/google/callback'
	}

};