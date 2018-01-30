const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const admin = require('./routes/admin')
const documents = require('./routes/documents')
const Assistant = require('./routes/Assistant')
const session = require('koa-generic-session');



// error handler
onerror(app)

// middlewares
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.keys = ['my secret key'];
app.use(session());


app.use(views(__dirname + '/views', {
	extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

var openPage = ['/', '/userRegister', '/login', '/Register', '/code'];
app.use(async (ctx, next) => {
	var url = ctx.originalUrl;
	console.log('url=' + url);
	url = (url.split('?'))[0];
	if (openPage.indexOf(url) > -1) {
		await next();
	} else {
		if (ctx.session.loginbean) {
			let loginbean = ctx.session.loginbean;
			ctx.state = {
				loginbean: loginbean,
			};
			await next();
		} else {
			ctx.redirect('/');
		}
	}
});
// routes
app.use(users.routes(), users.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())
app.use(Assistant.routes(), Assistant.allowedMethods())
app.use(documents.routes(), documents.allowedMethods())

// app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app