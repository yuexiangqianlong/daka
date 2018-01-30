const router = require('koa-router')();
var sequelize = require('../models/ModelHeader')();
var ModelRegister = require('../models/ModelRegister');
var ModelResult = require('../models/ModelResult');

router.get('/Assistant', async function(ctx, next) {
	await ctx.render('./Assistant/Assistant', {});
})

router.post('/Classes', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 2 && loginbean.asssistrole == 2) {
		if (ctx.request.body.classes == '全栈11班') {

			let sql = 'select a.*,r.name,r.options,r.text,r.createtime from results r,answers a where r.classes=?';
			let rs = await sequelize.query(sql, {
				replacements: [ctx.request.body.classes]
			});
			let rss = rs[0][0];
			var d = new Date(rss.createtime);
			let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
			await ctx.render('./Assistant/AssistantResult', {
				rs: rs[0],
				youWant: youWant
			});;

		} else {
			ctx.body = '请查询自己的班级';
		}
	} else if (loginbean.role == 2 && loginbean.asssistrole == 3) {
		if (ctx.request.body.classes == '游戏') {
			let sql = 'select a.*,r.name,r.options,r.text,r.createtime from results r,answers a where r.classes=?';
			let rs = await sequelize.query(sql, {
				replacements: [ctx.request.body.classes]
			});
			await ctx.render('./Assistant/AssistantResult', {
				rs: rs[0]
			});
		} else {
			ctx.body = '请查询自己的班级';
		}
	} else if (loginbean.role == 2 && loginbean.asssistrole == 5) {
		if (ctx.request.body.classes == '全栈9班') {
			let sql = 'select a.*,r.name,r.options,r.text,r.createtime from results r,answers a where r.classes=?';
			let rs = await sequelize.query(sql, {
				replacements: [ctx.request.body.classes]
			});
			await ctx.render('./Assistant/AssistantResult', {
				rs: rs[0]
			});

		} else {
			ctx.body = '请查询自己的班级';
		}
	} else if (loginbean.role == 2 && loginbean.asssistrole == 4) {
		if (ctx.request.body.classes == '全栈10班') {
			let sql = 'select a.*,r.name,r.options,r.text,r.createtime from results r,answers a where r.classes=?';
			let rs = await sequelize.query(sql, {
				replacements: [ctx.request.body.classes]
			});
			let rss = rs[0][0];
			var d = new Date(rss.createtime);
			let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
			await ctx.render('./Assistant/AssistantResult', {
				rs: rs[0],
				youWant: youWant
			});

		} else {
			ctx.body = '请查询自己的班级';
		}
	}
})
module.exports = router