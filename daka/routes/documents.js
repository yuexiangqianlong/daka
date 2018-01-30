const router = require('koa-router')();
var sequelize = require('../models/ModelHeader')();
var ModelRegister = require('../models/ModelRegister');
var ModelResult = require('../models/ModelResult');
var elastic = require('../models/elasticsearch');
/* GET suggestions */
router.get('/suggest/:input', async function(ctx, next) {
	let loginbean = ctx.session.loginbean;
	if (loginbean.role == 0) {
		let result = await elastic.getSuggestions(ctx.params.input).then(function(result) {
			return result.hits.hits
		});
		if (result[0] == undefined) {
			ctx.body = "<h2>找不到和您查询的“" + ctx.params.input + "”相符的内容或信息。<br/>建议：请尝试其他查询词。</h2>"
		} else {
			for (item of result) {
				let date = new Date(item._source.updtime);
				item._source.updtime = date;
			}
			// result[0]._source.updtime = new Date(result[0]._source.updtime);
			await ctx.render('admin/adminSearch', {
				result: result
			})
		}
	} else {
		ctx.body = "无权限"
	}

});
module.exports = router