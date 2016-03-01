var config = require('config');
var dnspod = require('dnspod-client'),
	client = new dnspod({
		'login_email': config.get('account.email'),
		'login_password': config.get('account.password')
	});

// client
// 	.domainList({length: 5})
// 	.on('domainList', function (err, data) {
// 		if (err) {
// 			throw err;
// 		} else {
// 			console.log(data);
// 		}
// 	});

// client
// 	.recordList({
// 		domain_id: config.get('domain.domain_id'),
// 		keyword: 'ddns',
// 		length: 2
// 	})
// 	.on('recordList', function (err, data) {
// 		if (err) {
// 			throw err;
// 		} else {
// 			console.log(data);
// 		}
// 	});



function setRecord (value) {
	client
		.recordModify({
			domain_id: config.get('domain.domain_id'),
			record_id: config.get('domain.record_id'),
			sub_domain: config.get('domain.sub_domain'),
			record_type: 'A',
			record_line: '默认',
			value: value,
			mx: '0',
		})
		.on('recordModify', function(err, data) {
			if (err) {
				throw err;
			} else {
				// console.log(data);
			}
		});
}

// client
//     .getHostIp()
//     .on('getHostIp', function (err, message) {
//         if (err) {
//             throw err;
//         } else {
//             console.log('get IP address: ' + message);
//         }
//     });