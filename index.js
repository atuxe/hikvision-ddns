var config = require('config');
var dnspod = require('dnspod-client'),
	client = new dnspod({
		'login_email': config.get('account.email'),
		'login_password': config.get('account.password')
	});

client
	.domainList({length: 5})
	.on('domainList', function (err, data) {
		if (err) {
			throw err;
		} else {
			console.log(data);
		}
	});