module.exports = function({ api, config, __GLOBAL, User, Thread, Economy, Fishing, Nsfw }) {
	return function({ event }) {
		const { confirm } = __GLOBAL;
		if (__GLOBAL.threadBlocked.indexOf(event.threadID) != -1) return;
		const { senderID, userID, threadID, reaction, messageID } = event;
		if (confirm.length != 0) {
			const indexOfConfirm = confirm.findIndex(e => e.messageID == messageID && e.author == userID);
			if (indexOfConfirm < 0) return;
			const confirmMessage = confirm[indexOfConfirm];
			switch (confirmMessage.type) {
				case 'fishing_sellAll': {
					if (reaction == '👍') {
						(async () => {
							let inventory = await Fishing.getInventory(confirmMessage.author);
							var money = parseInt(inventory.trash + inventory.fish1 * 30 + inventory.fish2 * 100 + inventory.crabs * 250 + inventory.blowfish * 300 + inventory.crocodiles * 500 + inventory.whales * 750 + inventory.dolphins * 750 + inventory.squid * 1000 + inventory.sharks * 1000);
							inventory.trash = 0;
							inventory.fish1 = 0;
							inventory.fish2 = 0;
							inventory.crabs = 0;
							inventory.crocodiles = 0;
							inventory.whales = 0;
							inventory.dolphins = 0;
							inventory.blowfish = 0;
							inventory.squid = 0;
							inventory.sharks = 0;
							await Fishing.updateInventory(confirmMessage.author, inventory);
							await Economy.addMoney(confirmMessage.author, money);
							api.sendMessage('🎣 | Bạn đã bán toàn bộ sản lượng trong túi và thu về được ' + money + ' đô', threadID, messageID);
						})();
					} else api.sendMessage('🎣 | Rất tiếc, bạn đã huỷ giao dịch này', threadID, messageID)
					break;
				}
			}
			__GLOBAL.confirm.splice(indexOfConfirm, 1);
			return;
		}
	}
}