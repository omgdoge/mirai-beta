if (event.type == 'message_reply' && searchMessage.some(item => item.id == event.messageReply.messageID) && senderID != api.getCurrentUserID() && senderID != api.getCurrentUserID()) return (contentMessage.length == 1 && parseInt(contentMessage) > 0 && parseInt(contentMessage) < 5) ? api.sendTypingIndicator(threadID, () => require("fluent-ffmpeg")().input(require("ytdl-core")(`https://www.youtube.com/watch?v=${searchMessage.find(item => item.id == event.messageReply.messageID).link[contentMessage - 1]}`)).toFormat("mp3").pipe(fs.createWriteStream(__dirname + "/src/music.mp3")).on("close", () => send({attachment: fs.createReadStream(__dirname + "/src/music.mp3")}, threadID, () => fs.unlinkSync(__dirname + "/src/music.mp3"), messageID))) : send('Hãy nhập một số từ 1 đến 5.', threadID, messageID);

          //Search YouTube
          if (contentMessage.indexOf(`${prefix}search`) == 0) {
            var content = contentMessage.slice(prefix.length + 7, contentMessage.length);
            if (!content) return send('Chưa nhập thông tin.', threadID, messageID);
            return request(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&key=${googleSearch}&q=${encodeURIComponent(content)}`, function(err, response, body) {
              var retrieve = JSON.parse(body), msg = '', num = 0, link = [];
              for (var i = 0; i < 5; i++) {
                if (typeof retrieve.items[i].id.videoId != 'undefined') {
                  link.push(retrieve.items[i].id.videoId);
                  msg += `${num += 1}. ${decodeURIComponent(retrieve.items[i].snippet.title)}\nhttps://www.youtube.com/watch?v=${retrieve.items[i].id.videoId}\n\n`;
                }
              }
              send(msg, threadID, (err, info) => searchMessage.push({id: info.messageID, link}), messageID);
            });
          }
         
          https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&key=AIzaSyBxo7837XxdK0oM8QHNj7IGxEsbw67s0f8&q=big city boi