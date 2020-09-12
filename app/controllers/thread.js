const logger = require("../modules/log.js");
module.exports = function({ models, api }) {
	const Thread = models.use('thread');

	async function createThread(threadID) {
		if (!await Thread.findOne({ where: { threadID } })) {
			let threadInfo = await getInfo(threadID);
			let name = threadInfo.name;
			let [ thread, created ] = await Thread.findOrCreate({ where: { threadID }, defaults: { name } });
			if (created) return logger(threadID, 'New Thread');
		}
	}

	async function getInfo(threadID) {
		return await api.getThreadInfo(threadID);
	}

	async function setThread(threadID, options = {}) {
		try {
			(await User.findOne({ where: { threadID } })).update(options);
			return true;
		}
		catch (err) {
			logger(err, 2);
			return false;
		}
	}

	async function delThread(threadID) {
		return (await User.findOne({ where: { threadID } })).destroy();
	}

	async function getThreads(attributes = [], where = {}) {
		if (!Array.isArray(attributes) && typeof attributes == 'object') where = attributes;
		try {
			return (await Thread.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (err) {
			logger(err, 2);
			return [];
		}
	}

	async function getName(threadID) {
		return (await Thread.findOne({ where: { threadID } })).get({ plain: true }).name;
	}

	async function updateName(threadID, name) {
		return (await Thread.findOne({ where: { threadID } })).update({ name });
	}

	async function unban(threadID, block = false) {
		try {
			(await Thread.findOne({ where: { threadID } })).update({ block });
			return true;
		}
		catch (err) {
			logger(err, 2);
			return false;
		}
	}

	async function ban(threadID) {
		return await unban(threadID, true);
	}

	async function blockResend(threadID, blockResend = true) {
		try {
			(await Thread.findOne({ where: { threadID } })).update({ blockResend });
			return true;
		}
		catch (err) {
			logger(err, 2);
			return false;
		}
	}

	async function unblockResend(threadID) {
		return await blockResend(threadID, false);
	}

	async function blockNSFW(threadID, blockNSFW = true) {
		try {
			(await Thread.findOne({ where: { threadID } })).update({ blockNSFW });
			return true;
		}
		catch (err) {
			logger(err, 2);
			return false;
		}
	}

	async function unblockNSFW(threadID) {
		return await blockNSFW(threadID, false);
	}

	return {
		createThread,
		getInfo,
		setThread,
		delThread,
		getName,
		getThreads,
		updateName,
		ban,
		unban,
		blockResend,
		unblockResend,
		blockNSFW,
		unblockNSFW
	}
}