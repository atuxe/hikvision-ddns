var config = require('config');
var net = require('net');
var util = require('util');
var dnspod = require('dnspod-client'),
	client = new dnspod({
		'login_email': config.get('account.email'),
		'login_password': config.get('account.password')
	});
var ip = null;

// client
// 	.domainList({
// 		length: 5,
// 		keyword: "boyuntong",
// 	})
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
// 		keyword: config.get('domain.sub_domain'),
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

function checkData (hexString) {
	var hexCount = parseInt(hexString.substring(0, 2), 16);
	if (hexString.length !== hexCount * 2) {
		return false;
	}
	hexString = hexString.slice(26);
	/**
	 * 0:unknow
	 * 1:device name
	 * 2:device id
	 * 3:mac addr
	 * 4:[http port,] tcp port
	 * @type array
	 */
	hexArray = hexString.split('000000');
	var deviceId = hex2a(hexArray[2].slice(0, -2));
	// console.log(deviceId);
	if (config.get('devices').indexOf(deviceId) == -1) {
		return false;
	}
	return true;
}

function hex2a(hexString) {
    var hex = hexString.toString();//force conversion
    var str = '';
    for (var i = 0; i < hexString.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i+2), 16));
    return str;
}

/**
 * 扩展数组的方法
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var server = net.createServer(function (socket) {
	var newIp = socket.remoteAddress.replace('::ffff:', '');
	if (ip === null) {
		ip = newIp;
	} else if(ip != newIp) {
		ip = newIp;
	}
	
	console.log(ip, socket.remotePort);
	socket.on('data', function (data) {
		var hexString = data.toString('hex');
		util.log(hexString);
		if (checkData(hexString) && ip != newIp) {
			// setRecord(ip);
			util.log('Trigger setRecord');
		}
	});

	socket.on('close', function(had_error) {
		if (had_error) {
		}
	});

	socket.on('error', function (error) {
		console.log(error);
	});
});

server.listen(7070);
console.log('socket is listening on 7070');