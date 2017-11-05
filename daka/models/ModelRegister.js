var Sequelize = require('sequelize');
var sequelize = require('./ModelHeader')();

var MenuModel = sequelize.define('users', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	name: Sequelize.STRING,
	pwd: Sequelize.STRING,
	asssistrole: Sequelize.INTEGER,
	classes: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime: Sequelize.DATE,
	role: Sequelize.INTEGER,
}, {
	timestamps: false,
	//paranoid: true  //获取不到id的返回值
});
module.exports = MenuModel;