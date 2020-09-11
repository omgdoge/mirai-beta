const fs = require("fs-extra");
function writeENV(tag, input) {
	return fs.readFile('./.env', { encoding: 'utf-8' }, function(err, data) {
		if (err) throw err;
		data = data.split('\n');
		let lastIndex = -1;
		for (let i = 0; i < data.length; i++) {
			if (data[i].includes(`${tag}=`)) {
				lastIndex = i;
				break;
			}
		}
		data[lastIndex] = `${tag}=${input}`;
		const dataJoin = data.join('\n');
		fs.writeFileSync('./.env', dataJoin);
	});
}

module.exports = function({ api, config, __GLOBAL, User, Thread, Economy, Fishing, Nsfw }) {
	return function({ event }) {
		const cmd = require("node-cmd");
		const axios = require('axios');
		const { reply } = __GLOBAL;
		if (__GLOBAL.threadBlocked.indexOf(event.threadID) != -1) return;
		const { senderID, threadID, body, messageID } = event;
		if (reply.length != 0) {
			if (!event.messageReply) return;
			const indexOfReply = reply.findIndex(e => e.messageID == event.messageReply.messageID && e.author == senderID);
			if (indexOfReply < 0) return;
			const replyMessage = reply[indexOfReply];
			switch (replyMessage.type) {
				case "admin_settings": {
					if (body == '1') {
						api.sendMessage(`Prefix hiện tại của bot là: ${config.prefix}\n=== Để đổi bạn hãy reply đoạn tin nhắn này với prefix bạn muốn đổi thành ===`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_prefix",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '2') {
						api.sendMessage(`Tên hiện tại của bot là: ${config.botName}\n=== Để đổi bạn hãy reply đoạn tin nhắn này với tên bạn muốn đổi thành ===`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_setName",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '3') {
						(async () => {
							let admins = '';
							let users = await User.getUsers(['name', 'uid']);
							users.forEach(i => {
								if (config.admins.includes(i.uid)) admins += `\n- ${i.name}`;
							})
							api.sendMessage(`Admins hiện tại của bot là: ${admins}\n=== Để đổi bạn hãy reply đoạn tin nhắn này với uid (hoặc uid1_uid2_...) bạn muốn đổi thành ===`, threadID, (err, info) => {
								if (err) throw err;
								__GLOBAL.reply.push({
									type: "admin_setAdmin",
									messageID: info.messageID,
									target: parseInt(threadID),
									author: senderID
								});
							});
						})();
					}
					else if (body == '4') {
						api.sendMessage(`Tự khởi động lại bot hiện tại đang là: ${process.env.REFRESHING}\n=== Để đổi bạn hãy reply đoạn tin nhắn này kèm với on hay off ===`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_setRefresh",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '5') {
						api.sendMessage(`Giờ nhắc ngủ của bot hiện đang là: ${config.sleeptime}\n=== Để đổi bạn hãy reply đoạn tin nhắn này kèm với thời gian bạn muốn thay, lưu ý theo dạng 24h, ví dụ: 22:00 ===`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_setSleepTime",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '6') {
						api.sendMessage(`Giờ nhắc dậy của bot hiện đang là: ${config.waketime}\n=== Để đổi bạn hãy reply đoạn tin nhắn này kèm với thời gian bạn muốn thay, lưu ý theo dạng 24h, ví dụ: 07:00 ===`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_setWakeTime",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '7') {
						const semver = require('semver');
						axios.get('https://raw.githubusercontent.com/roxtigger2003/mirai/master/package.json').then((res) => {
							var local = JSON.parse(fs.readFileSync('./package.json')).version;
							if (semver.lt(local, res.data.version)) {
								api.sendMessage('Đã có bản cập nhật mới! Hãy bật terminal/cmd và gõ "node update" để cập nhật!', threadID);
								fs.writeFileSync('./.updateAvailable', '');
							}
							else api.sendMessage('Bạn đang sử dụng bản mới nhất!', threadID);
						}).catch(err => api.sendMessage('Không thể kiểm tra cập nhật!', threadID));
					}
					else if (body == '8') {
						(async () => {
							var data = await User.getUsers(['name', 'uid'], {block: true});
							var userBlockMsg = "";
							data.forEach(user => userBlockMsg += `\n${user.name} - ${user.uid}`);
							api.sendMessage((userBlockMsg) ? `🛠 | Đây là danh sách các user bị block:${userBlockMsg}` : 'Chưa có user nào bị bạn cấm!', threadID, messageID);
						})();
					}
					else if (body == '9') {
						(async () => {
							var data = await Thread.getThreads(['name', 'threadID'], {block: true});
							var threadBlockMsg = "";
							data.forEach(thread => threadBlockMsg += `\n${thread.name} - ${thread.threadID}`);
							api.sendMessage((threadBlockMsg) ? `🛠 | Đây là danh sách các nhóm bị block:${threadBlockMsg}` : 'Chưa có nhóm nào bị bạn cấm!', threadID, messageID);
						})();
					}
					else if (body == '10') {
						api.sendMessage(`Nhập thông báo bạn muốn gửi cho toàn bộ`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_noti",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '11') {
						api.sendMessage(`Nhập tên user cần tìm kiếm`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_searchUser",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '12') {
						api.sendMessage(`Nhập tên nhóm cần tìm kiếm`, threadID, (err, info) => {
							if (err) throw err;
							__GLOBAL.reply.push({
								type: "admin_searchThread",
								messageID: info.messageID,
								target: parseInt(threadID),
								author: senderID
							});
						});
					}
					else if (body == '13') api.sendMessage(`Tiến hành áp dụng thay đổi, vui lòng đợi một chút để bot đồng bộ!`, threadID, () => cmd.run("pm2 restart 0"));
					else {
						let array = ['Hình như bạn đang chơi đồ?', 'Đồ ngon quá à bạn?', 'Bú gì ngon vậy?'];
						api.sendMessage(array[Math.floor(Math.random() * array.length)], threadID);
					}
					break;
				}
				case "admin_prefix": {
					writeENV("PREFIX", body);
					api.sendMessage(`🛠 | Đã đổi prefix của bot thành: ${body}`, threadID);
					__GLOBAL.reply.splice(indexOfReply, 1);
					break;
				}
				case "admin_setName": {
					writeENV("BOT_NAME", body);
					api.sendMessage(`🛠 | Đã đổi tên của bot thành: ${body}`, threadID);
					__GLOBAL.reply.splice(indexOfReply, 1);
					break;
				}
				case "admin_setAdmins": {
					writeENV("ADMINS", body);
					api.sendMessage(`🛠 | Đã đổi admins của bot thành: ${body}`, threadID);
					__GLOBAL.reply.splice(indexOfReply, 1);
					break;
				}
				case "admin_setRefresh": {
					if (body != 'on' && body != 'off') return api.sendMessage(`Chỉ có thể là 'on' hoặc 'off'.`, threadID);
					writeENV("REFRESHING", body);
					api.sendMessage(`🛠 | Đã đổi khởi động lại của bot thành: ${body}`, threadID);
					__GLOBAL.reply.splice(indexOfReply, 1);
					break;
				}
				case "admin_setSleepTime": {
					writeENV("SLEEPTIME", body);
					api.sendMessage(`🛠 | Đã đổi giờ nhắc ngủ của bot thành: ${body}`, threadID);
					__GLOBAL.reply.splice(indexOfReply, 1);
					break;
				}
				case "admin_setWakeTime": {
					writeENV("WAKETIME", body);
					api.sendMessage(`🛠 | Đã đổi giờ nhắc dậy của bot thành: ${body}`, threadID);
					__GLOBAL.reply.splice(indexOfReply, 1);
					break;
				}
				case "admin_noti": {
					return api.getThreadList(100, null, ["INBOX"], (err, list) => {
						if (err) throw err;
						list.forEach(item => (item.isGroup == true && item.threadID != threadID) ? api.sendMessage(body, item.threadID) : '');
						api.sendMessage('Đã gửi thông báo với nội dung:\n' + body, threadID);
					});
					__GLOBAL.reply.splice(indexOfReply, 1);
					break;
				}
				case "admin_searchUser": {
					(async () => {
						let getUsers = await User.getUsers(['uid', 'name']);
						let matchUsers = [], a = '', b = 0;
						getUsers.forEach(i => {
							if (i.name.toLowerCase().includes(body.toLowerCase())) {
								matchUsers.push({
									name: i.name,
									id: i.uid
								});
							}
						});
						matchUsers.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
						(matchUsers.length > 0) ? api.sendMessage(`Đã tìm thấy ${b} user${(b > 1) ? 's' : ''}:${a}`, threadID) : api.sendMessage(`Không tìm thấy user nào có tên ${body}`, threadID);
					})();
					break;
				}
				case "admin_searchThread": {
					(async () => {
						let getThreads = (await Thread.getThreads(['threadID', 'name'])).filter(item => !!item.name);
						let matchThreads = [], a = '', b = 0;
						getThreads.forEach(i => {
							if (i.name.toLowerCase().includes(body.toLowerCase())) {
								matchThreads.push({
									name: i.name,
									id: i.threadID
								});
							}
						});
						matchThreads.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
						(matchThreads.length > 0) ? api.sendMessage(`Đã tìm thấy ${b} nhóm:${a}`, threadID) : api.sendMessage(`Không tìm thấy nhóm nào có tên ${body}`, threadID);
					})();
					break;
				}
			}
			return;
		}
	}
}