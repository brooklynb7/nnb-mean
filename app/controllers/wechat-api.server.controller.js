'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	config = require('../../config/config'),
	wechat = require('wechat'),
	API = require('wechat-api'),
	api = new API(config.wechat.appId, config.wechat.appSecret),
	menuButton = config.wechat.menuButton;


var MessageHandler = function(wechatUser, message, response) {
	this.wechatUser = wechatUser;
	this.message = message;
	this.res = response;
};

MessageHandler.prototype.is_subscribe_event = function() {
	var message = this.message;
	if (message.MsgType === config.wechat.msgType.event &&
		message.Event === config.wechat.event.subscribe) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_scan_event = function() {
	if (this.message.MsgType === config.wechat.msgType.event &&
		this.message.Event === config.wechat.event.scan) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_location_event = function() {
	if (this.message.MsgType === config.wechat.msgType.location) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_normal_text = function() {
	if (this.message.MsgType === config.wechat.msgType.text) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.is_menu_click = function() {
	if (this.message.MsgType === config.wechat.msgType.event &&
		this.message.Event === config.wechat.event.click) {
		return true;
	} else {
		return false;
	}
};

MessageHandler.prototype.subscribe_event_handler = function() {
	this.res.reply('感谢您关注奶牛帮！我们将竭诚为您服务');
};

//'oBGqGjkX4rAjcMhTjthPuiFz1Jac'
MessageHandler.prototype.menu_event_handler = function() {
	var eventKey = this.message.EventKey;
	var msg = '';

	switch (eventKey) {
		case menuButton.bestGift.key:
			msg = menuButton.bestGift.msg;
			break;
		case menuButton.openMilk.key:
			msg = menuButton.openMilk.msg;
			break;
		case menuButton.expertWord.key:
			msg = menuButton.expertWord.msg;
			break;
		case menuButton.ourPrice.key:
			msg = menuButton.ourPrice.msg;
			break;
		case menuButton.honor.key:
			msg = menuButton.honor.msg;
			break;
		case menuButton.contactUs.key:
			msg = menuButton.contactUs.msg;
			break;
		default:
			break;
	}
	this.res.reply(msg);
};

MessageHandler.prototype.scan_event_handler = function() {
	var that = this;
	var sceneId = this.message.EventKey;
};

MessageHandler.prototype.response_empty = function() {
	this.res.reply('');
};

var handler = new MessageHandler();


function message_handler(handler) {
	switch (true) {
		case handler.is_subscribe_event():
			handler.subscribe_event_handler();
			break;
		case handler.is_menu_click():
			handler.menu_event_handler();
			break;
		default:
			handler.response_empty();
			break;
	}
}

exports.index = wechat(config.wechat.token, function(req, res, next) {
	// 微信输入信息都在req.wechat上
	var message = req.weixin;
	handler.res = res;
	handler.message = message;
	message_handler(handler);
});

exports.createMenu = function(req, res) {
	api.createMenu({
		'button': [{
			'name': menuButton.valuableBook.name,
			'sub_button': [{
				'type': 'click',
				'name': menuButton.bestGift.name,
				'key': menuButton.bestGift.key
			}, {
				'type': 'click',
				'name': menuButton.openMilk.name,
				'key': menuButton.openMilk.key
			}, {
				'type': 'click',
				'name': menuButton.expertWord.name,
				'key': menuButton.expertWord.key
			}]
		}, {
			'type': 'click',
			'name': menuButton.ourPrice.name,
			'key': menuButton.ourPrice.key
		}, {
			'name': '奶牛帮',
			'sub_button': [{
				'type': 'click',
				'name': menuButton.honor.name,
				'key': menuButton.honor.key
			}, {
				'type': 'click',
				'name': menuButton.contactUs.name,
				'key': menuButton.contactUs.key
			}]
		}]
	}, function(err, rst) {
		res.send(rst);
	});
};

exports.test = function(req, res) {
	res.send('Wechat Api');
};