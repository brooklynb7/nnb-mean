'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Order Schema
 */
var Survey1Model = new Schema({
	channel: {
		type: Number,
		required: '请填写完整',
		trim: true
	},
	willOrder: {
		type: Number,
		required: '请填写完整',
		trim: true
	},
	acceptService: {
		type: Number,
		required: '请填写完整',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Survey1', Survey1Model);