const logger = require("../modules/log.js");
module.exports = function({ models, api }) {
	const Fishing = models.use("user");

/* ==================== Last Time Fishing ==================== */

	function lastTimeFishing(uid) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(fishing) {
			if (!fishing) return;
			return fishing.get({ plain: true }).lastTimeFishing;
		});
	}

	function updateLastTimeFishing(uid, lastTimeFishing) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(fishing) {
			if (!fishing) return;
			return fishing.update({ lastTimeFishing });
		}).then(function() {
			return true;
		}).catch(function(error) {
			logger(error, 2);
			return false;
		});
	}
	
/* ==================== Inventory ==================== */

	function getInventory(uid) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(fishing) {
			if (!fishing) return;
			return fishing.get({ plain: true }).inventory;
		});
	}

	function updateInventory(uid, inventory) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(fishing) {
			if (!fishing) return;
			return fishing.update({ inventory });
		}).then(function() {
			return true;
		}).catch(function(error) {
			logger(error, 2);
			return false;
		});
	}

/* ==================== Stats ==================== */

	function getStats(uid) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(fishing) {
			if (!fishing) return;
			return fishing.get({ plain: true }).stats;
		});
	}

	function updateStats(uid, stats) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(fishing) {
			if (!fishing) return;
			return fishing.update({ stats });
		}).then(function() {
			return true;
		}).catch(function(error) {
			logger(error, 2);
			return false;
		});
	}

/* =================== Steal fishing ==================== */

	function getStealFishingTime(uid) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(user) {
			if (!user) return;
			return user.get({ plain: true }).stealfishtime;
		});
	}

	function updateStealFishingTime(uid, stealfishtime) {
		return Fishing.findOne({
			where: {
				uid
			}
		}).then(function(user) {
			if (!user) return;
			return user.update({ stealfishtime });
		}).then(function() {
			return true;
		}).catch(function(error) {
			logger(error, 2);
			return false;
		});
	}

	return {
		lastTimeFishing,
		updateLastTimeFishing,
		getInventory,
		updateInventory,
		getStats,
		updateStats,
		getStealFishingTime,
		updateStealFishingTime
	};
};
