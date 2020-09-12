const logger = require("../modules/log.js");
module.exports = function({ models, api }) {
	const Rank = models.use("user");
	const FACTOR = 3;

	async function getPoint(uid) {
		return (await Rank.findOne({ where: { uid } })).get({ plain: true }).point;
	}

	async function updatePoint(uid, pointIncrement) {
		let point = (await getPoint(uid)) + pointIncrement;
		try {
			(await Rank.findOne({ where: { uid } })).update({ point });
			return true;
		}
		catch (err) {
			logger(error, 2);
			return false;
		}
	}

	async function setPoint(uid, point) {
		try {
			(await Rank.findOne({ where: { uid } })).update({ point });
			return true;
		}
		catch (err) {
			logger(error, 2);
			return false;
		}
	}

	function expToLevel(point) {
		if (point < 0) return 0;
		return Math.floor((Math.sqrt(1 + (4 * point) / FACTOR) + 1) / 2);
	}

	function levelToExp(level) {
		if (level <= 0) return 0;
		return FACTOR * level * (level - 1);
	}

	function getInfo(point) {
		const level = expToLevel(point);
		const expCurrent = point - levelToExp(level);
		const expNextLevel = levelToExp(level + 1) - levelToExp(level);
		return { level, expCurrent, expNextLevel };
	}

	return {
		getPoint,
		updatePoint,
		setPoint
	};
};
