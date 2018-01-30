const router = require('koa-router')();
var sequelize = require('../models/ModelHeader')();
var ModelRegister = require('../models/ModelRegister');
var ModelResult = require('../models/ModelResult');

router.get('/adminList', async function(ctx, next) {
	await ctx.render('./admin/admin', {});
})

router.get('/addscore', async function(ctx, next) {
	await ctx.render('./admin/addscore', {});
})

router.get('/Pointscore', async function(ctx, next) {
	await ctx.render('./admin/Pointscore', {});
})

router.get('/adminsearchStudents', async function(ctx, next) {
	await ctx.render('./admin/adminsearchStudents', {});
})


router.get('/adminClass', async function(ctx, next) {
	await ctx.render('./admin/adminClass', {});
})

router.get('/adminResult', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let sql = "select count(1) from results where topic=? and options='A';";
		let rs = await sequelize.query(sql, {
			replacements: [ctx.query['topic']]
		});
		let aa = rs[0][0]
		let sqlB = "select count(1) from results where topic=? and options='B';";
		let rsB = await sequelize.query(sqlB, {
			replacements: [ctx.query['topic']]
		});
		let sqlC = "select count(1) from results where topic=? and options='C';";
		let rsC = await sequelize.query(sqlC, {
			replacements: [ctx.query['topic']]
		});
		let sqlD = "select count(1) from results where topic=? and options='D';";
		let rsD = await sequelize.query(sqlD, {
			replacements: [ctx.query['topic']]
		});
		for (let key in aa) {
			let bb = rsB[0][0]
			for (let b in bb) {
				let cc = rsC[0][0]
				for (let c in cc) {
					let dd = rsD[0][0]
					for (d in dd) {
						await ctx.render('./admin/adminResult', {
							rs: aa[key],
							rs1: bb[b],
							rs2: cc[c],
							rs3: dd[d]
						});
					}
				}
			}
		}
	}
});

router.get('/adminText', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let page = 1; //页数
		if (ctx.query.page) {
			page = ctx.query.page;
		}
		let pageItem = 3; //每页显示条目数
		let startPoint = (page - 1) * pageItem; //查询起点位置
		let rowCount = 0; //总记录数
		let sumpage = 0;
		let rs2 = await sequelize.query('select count(*) as count from results where topic=?; ', {
			replacements: [ctx.query['topic']]
		})
		if (rs2) {
			rs1 = JSON.parse(JSON.stringify(rs2[0]));
			rowCount = rs1[0].count; //总记录数
			sumpage = Math.ceil(rowCount / pageItem);
			let sql = "select * from results  where topic=? limit ?,?;";
			let rs = await sequelize.query(sql, {
				replacements: [ctx.query['topic'], startPoint, pageItem]
			})
			await ctx.render('./admin/adminText', {
				rs: rs[0],
				page: page,
				rowCount: rowCount,
				sumpage: sumpage

			});
		}

	}
})

router.get('/adminDelect', async function(ctx, next) {
	console.log(ctx.query['topic']);
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let sql = "delete from results where id=?;";
		let rs = await sequelize.query(sql, {
			replacements: [ctx.query['topic']]
		});
		ctx.redirect('/adminList');
	}
});

router.get('/adminAll', async function(ctx, next) {
	console.log(ctx.query['topic'] + '---------------------');
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let sql = "delete from results where topic=?;";
		let rs = await sequelize.query(sql, {
			replacements: [ctx.query['topic']]
		});
		ctx.redirect('/adminList');
	}
})

router.get('/zero', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let sql = 'delete from results;';
		let rs = await sequelize.query(sql);
	}
	ctx.redirect('/adminList');
})

router.post('/admincls', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	let sql = "select topic,options,count(options) `count` from results where classes=? and options is not null group by topic,options;";
	let rs1 = await sequelize.query(sql, {
		replacements: [ctx.request.body.classes]
	});
	console.log(rs1[0]);
	if (rs1[0]) {
		let sql = 'select a.*,r.name,r.options,r.text from results r,answers a where r.classes=?';
		let rs = await sequelize.query(sql, {
			replacements: [ctx.request.body.classes]
		});
		await ctx.render('./admin/admincls', {
			rs1: rs1[0],
			rs: rs[0]
		});
	}
})

router.post('/Pointscore', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let score = ctx.request.body.op - ctx.request.body.score;
		let sql = "update users set score=?,reason=? where id=?;";
		let rs = await sequelize.query(sql, {
			replacements: [score, ctx.request.body.reason, ctx.request.body.pid]
		});
		if (rs) {
			ctx.body = "0"
		}

	}
})

router.post('/addscore', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let score = parseInt(ctx.request.body.op) + parseInt(ctx.request.body.score);
		let sql = "update users set score=? where id=?;";
		let rs = await sequelize.query(sql, {
			replacements: [score, ctx.request.body.pid]
		});
		if (rs) {
			ctx.body = "0"
		}

	}
})
module.exports = router