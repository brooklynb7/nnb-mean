'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	nickName: {
		type: String,
		default: '',
		trim: true
	},
	phone: {
		type: String,
		default: '',
		required: '请填写电话号码',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	daysAfterBearing: {
		type: String,
		default: '',
		trim: true
	},
	hasFever: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updated:{
		type: Date
	},
	updatedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	status: {
		type: Number,
		default: 0
	}
});

mongoose.model('Order', OrderSchema);