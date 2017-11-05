var Sequelize = require('sequelize');
var sequelize = require('./ModelHeader')();

var MenuModel = sequelize.define('results', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	name: Sequelize.STRING,
	topic: Sequelize.INTEGER,
	options: Sequelize.STRING,
	text: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime: Sequelize.DATE,
}, {
	timestamps: false,
	//paranoid: true  //获取不到id的返回值
});
module.exports = MenuModel;