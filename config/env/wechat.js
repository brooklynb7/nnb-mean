'use strict';
var appId = 'wxd2e4a7bd53b46381';
var appSecret = '52b183c9341ff58bc70dc7e6c2f9b0c7';

module.exports = {
	wechat: {
		port: 9002,
		token: 'nnb',
		appId: appId,
		appSecret: appSecret,
		account: 'otmarine@vip.163.com',
		msgType: {
			event: 'event',
			text: 'text',
			location: 'location'
		},
		event: {
			subscribe: 'subscribe',
			click: 'CLICK',
			view: 'VIEW',
			scan: 'SCAN'
		},
		mp_url: 'https://mp.weixin.qq.com/',
		mp_login_url: 'https://mp.weixin.qq.com/cgi-bin/login?lang=zh_CN',
		generateOAuthUrl: function(redirect_uri) {
			return 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
				'appid=' + appId + '&' +
				'redirect_uri=' + encodeURIComponent(redirect_uri) + '&' +
				'response_type=code&' +
				'scope=snsapi_base&' +
				'state=1#wechat_redirect';
		},
		subscribeMsg: '感谢您关注奶牛帮！我们将竭诚为您服务',
		menuButton: {
			valuableBook: {
				name: '母乳喂养'
			},
			bestGift: {
				name: '母乳,宝宝最好的礼物',
				key: 'BEST_GIFT',
				msg: '母乳是上天赐给婴儿最好的食物，它易消化、好吸收，含有多种免疫物质，可帮助婴儿抵抗疾病，又能避免牛奶蛋白过敏所造成的伤害，不但经济、卫生又安全，且妈妈可借着哺乳，增进亲子间的互动，帮助宝宝建立安全感。更可帮助妈妈子宫收缩、避孕，并能有效减少乳腺癌的产生。'
			},
			openMilk: {
				name: '\'开奶\'的重要性',
				key: 'OPEN_MILK',
				msg: '新手妈妈要进行母乳喂养，首先是开奶。这一步是很关键的，如果没做好，会对以后的母乳喂养埋下隐患。一是宝宝可能会拒绝母乳，二是妈妈也可能发生奶水不足或奶涨奶结的情况，严重的还会发生急性乳腺炎。所以，新手妈妈们千万不可忽视开奶的重要性。'
			},
			expertWord: {
				name: '专家的话',
				key: 'EXPERT_WORD',
				msg: '世界卫生组织这样说：在婴儿出生的头一个小时里就开始母乳喂养；“根据需要”进行母乳喂养，不管白天或是晚上，婴儿一旦有需要就进行喂养，不使用奶瓶或安抚奶嘴。\n我国卫生部这样说：应当在新生儿出生后1小时内开始喂奶，早接触、早吸吮、早开奶，按需哺乳。'
			},
			ourPrice: {
				name: '价格咨询',
				key: 'OUR_PRICE',
				msg: '上门服务\n中环以内：600/次\n中环以外：700/次'
			},
			honor: {
				name: '资质荣誉',
				key: 'NONOR',
				msg: '奶牛帮是上海市总工会唯一指定和认可的哺乳指导机构。\n开奶师构成：\n\t30年以上临床经验的资深产科护士\n\t持有人社部高级催乳师证书的资深母乳喂养指导师'
			},
			contactUs: {
				name: '联系我们',
				key: 'CONTACT_US',
				msg: '联系电话: 12345678\n联系微信: abcdefg'
			}
		}
	}
};