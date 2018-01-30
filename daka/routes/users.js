const router = require('koa-router')();
var sequelize = require('../models/ModelHeader')();
var ModelRegister = require('../models/ModelRegister');
var ModelResult = require('../models/ModelResult');
var http = require('http');
var querystring = require('querystring');

// router.prefix('/users')

router.get('/', async function(ctx, next) {
	await ctx.render('./user/userIndex', {});
})
router.get('/userRegister', async function(ctx, next) {
	await ctx.render('./user/userRegister', {});

})
router.get('/success', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	let sql = 'select  createtime,frequency from users where id=?'
	let time = await sequelize.query(sql, {
		replacements: [loginbean.id]
	})
	let aa = time[0]
	await ctx.render('./user/success', {
		time: aa
	});

})
let o = 0;
router.post('/login', async function(ctx, next) {
	console.log(ctx.request.body.classes);
	let rs = await new Promise(function(resolve, reject) {
		ModelRegister.findOne({
			where: {
				name: ctx.request.body.name,
				classes: ctx.request.body.classes,
				pwd: ctx.request.body.pwd,
			}
		}).then(function(rs) {
			if (rs != null) {
				let loginbean = new Object();
				loginbean.id = rs.id;
				loginbean.classes = rs.classes;
				loginbean.role = rs.role;
				loginbean.asssistrole = rs.asssistrole;
				loginbean.name = rs.name;
				ctx.session.loginbean = loginbean;
				//ctx.redirect('/admin/index');
				resolve(1);
			} else {
				resolve(2);
			}
		});
	})

	if (rs == 1) {
		if (ctx.session.loginbean.role == 1) {
			let sql = "select frequency,id,updtime from users where name=?;";
			let rs1 = await sequelize.query(sql, {
				replacements: [ctx.request.body.name]
			});
			let frequency = rs1[0][0];
			let id = rs1[0][0];
			let fre = frequency.frequency + Number(ctx.request.body.frequency);
			let str = frequency.updtime;
			let myDate = new Date();
			let myarray = str.toString().split("-");
			let my = myarray[0].split(" ");
			if (myDate.getDate() != Number(my[2])) {
				let sql1 = 'update users set frequency=? where id=?';
				let rs2 = await sequelize.query(sql1, {
					replacements: [fre, id.id]
				});

				let answerRs = await sequelize.query('select * from answers where id=1');
				let At = answerRs[0];
				await ctx.render('./Answer/AnswerSurvey', {
					answerRs: At[0]
				});
			} else {
				ctx.body = '您今天已经登陆过了，一天只能登陆一次！'
			}
		} else if (ctx.session.loginbean.role == 0) {
			ctx.redirect('/adminList');
		} else if (ctx.session.loginbean.role == 2) {
			ctx.redirect('/Assistant');
		}
	} else {
		ctx.body = '姓名/班级/密码错误';
	}

})

router.post('/Register', async function(ctx, next) {
	if (typeof(ctx.session.loginbean) == "undefined") {
		ctx.body = '请填写正确的手机号验证码';
	} else {
		if (ctx.request.body.phone == ctx.session.loginbean.phone && ctx.request.body.code == ctx.session.loginbean.code) {
			let sql = 'insert into users set name=?,pwd=?,classes=?,frequency=?,phone=?'
			let rs = await sequelize.query(sql, {
				replacements: [ctx.request.body.name, ctx.request.body.pwd, ctx.request.body.classes, ctx.request.body.frequency, ctx.request.body.phone]
			}).catch(function(err) {
				if (err.errors[0].path == 'nameuniq') {
					ctx.body = '姓名重复'
				}
			})
			if (rs != undefined) {
				let sql = 'select * from users where id=?';
				let userRs = await sequelize.query(sql, {
					replacements: [rs[0]]
				});
				let UserRs = userRs[0];
				let loginbean = new Object();
				loginbean.id = UserRs[0].id;
				loginbean.classes = UserRs[0].classes;
				loginbean.adminrole = UserRs[0].role;
				loginbean.asssistrole = UserRs[0].asssistrole;
				loginbean.name = UserRs[0].name;
				ctx.session.loginbean = loginbean;
				console.log(loginbean);
				if (UserRs) {
					let answerRs = await sequelize.query('select * from answers');
					await ctx.render('./Answer/AnswerSurvey', {
						answerRs: answerRs[0][0]
					});
					console.log(answerRs[0]);
				}
			}

		} else {
			ctx.body = '验证码或手机号错误';
		}
	}

})
router.post('/result', async function(ctx, next) {
	let text = ctx.request.body.text;
	let loginbean = ctx.session.loginbean;
	if (ctx.request.body.options == null) {
		ctx.body = '请选择';
	} else {
		let id = Number(ctx.request.body.topic) + 1;
		if (ctx.request.body.topic == 5) {
			let sql = 'insert into results set topic=?,options=?,name=?,classes=?';
			let rs = await sequelize.query(sql, {
				replacements: [
					ctx.request.body.topic,
					ctx.request.body.options,
					loginbean.name,
					loginbean.classes
				]
			})
			let answersId = id.toString()
			let answerRs = await sequelize.query('select * from answers where id=?', {
				replacements: [answersId]
			});
			console.log(answerRs[0]);
			await ctx.render('./Answer/AnswerWrite', {
				answerRs: answerRs[0][0]
			});
		} else {
			if (ctx.request.body.topic == 6) {
				let sql = 'insert into results set topic=?,text=?,name=?,classes=?';
				let rs = await sequelize.query(sql, {
					replacements: [
						ctx.request.body.topic,
						text,
						loginbean.name,
						loginbean.classes
					]
				})
				ctx.redirect('/success');
			} else {
				let answersId = id.toString()
				let answerRs = await sequelize.query('select * from answers where id=?', {
					replacements: [answersId]
				});
				console.log(answerRs[0]);
				let sql = 'insert into results set topic=?,options=?,name=?,classes=?';
				let rs = await sequelize.query(sql, {
					replacements: [
						ctx.request.body.topic,
						ctx.request.body.options,
						loginbean.name,
						loginbean.classes
					]
				})
				await ctx.render('./Answer/AnswerSurvey', {
					answerRs: answerRs[0][0]
				});

			}
		}
	}
});
router.post('/code', async function(ctx, next) {
	let arr = new Array();
	for (let i = 0; i < 10; i++) {
		arr.push(i);
	}
	for (let i = 0; i < 600; i++) {
		m = Math.floor(Math.random() * 9 + 0);
		n = Math.floor(Math.random() * 9 + 0);
		k = arr[m];
		arr[m] = arr[n];
		arr[n] = k;
	}
	let code = arr[0] + '' + arr[1] + '' + arr[2] + '' + arr[3] + '' + arr[4] + '' + arr[5];
	var reqData = querystring.stringify({
		'CorpID': 'suowei',
		'Pwd': '008899.zlx',
		"Mobile": ctx.request.body.phone,
		'Content': '【索维智能打卡系统】账号安全验证码是' + code + '，10分钟内有效。'
	});
	var post_options = {
		host: '101.200.29.88',
		port: '8082',
		path: '/SendMT/SendMessage',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(reqData, 'utf8')
		}
	};
	var req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			console.log(typeof(chunk));
			if (chunk == '09') {
				ctx.body = '手机号错误';
			} else if (chunk == '11') {
				ctx.body = '余额不足';
			}
			console.log("body1: " + chunk);
		});
		res.on('end', function(chunk) {
			console.log("body2: " + chunk);
		})
	})
	req.write(reqData);
	req.end();
	let loginbean = new Object();
	loginbean.phone = ctx.request.body.phone;
	loginbean.code = code;
	ctx.session.loginbean = loginbean;

})
module.exports = router