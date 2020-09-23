module.exports = function({ api, config, __GLOBAL, User, Thread }) {
	return async function({ event }) {
		let { senderID, threadID, messageID } = event;
		let { admins, warningrate, tempban, ratelimit } = config
		senderID = parseInt(senderID);
		threadID = parseInt(threadID);
		if (__GLOBAL.threadBlocked.includes(threadID) || __GLOBAL.userBlocked.includes(senderID)) return;
		var entry = __GLOBAL.slowmode.get(senderID);
		if(!entry) {
			entry = 0;
			__GLOBAL.slowmode.set(senderID, entry);
		}
		entry += 1;
		__GLOBAL.slowmode.set(senderID, entry);
		if (entry > warningrate) {
			__GLOBAL.userBlocked.push(parseInt(senderID));
			api.sendMessage("⚠️ Hệ thống phát hiện bạn đang nhắn tin với tốc độ ánh sáng, bạn sẽ bị ban trong vòng 1 phút để cảnh cáo", threadID, messageID);
			await new Promise(resolve => setTimeout(resolve, tempban * 1000));
			api.sendMessage("⚠️ 1 phút tạm ban của bạn đã hết, nếu bạn còn tái phạm thì hình phạt của bạn trở nên nặng hơn!", threadID, messageID);
			__GLOBAL.userBlocked.splice(__GLOBAL.userBlocked.indexOf(parseInt(senderID)), 1);
			__GLOBAL.slowmode.delete(senderID);
		} 
		else {
			setTimeout(()=> {
				entry -= 1;
				if(entry <= 0) __GLOBAL.slowmode.delete(senderID);
			}, ratelimit);
		}
	}
}