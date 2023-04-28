const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
// replace the value below with the Telegram token you receive from @BotFather
const token = "6242924573:AAH4lNsOgIsReGPCaaacK2RoB918fIYZVfU";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  let messageText,
    dateTime,
    sender = "";

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  dateTime = timeConverter(msg.date);
  if (msg.forward_signature != undefined) {
    sender = msg.forward_signature;
  } else {
    sender = msg.from.first_name;
  }

  if (msg.photo != undefined) {
    messageText = msg.caption;
  } else {
    messageText = msg.text;
  }
  let str = messageText;
  const conTele = str.replace(/(https?:\/\/[^\s]+)/g, "<$1>");
  const reply = "\n\n> **Ini pesan otomatis dari " + sender + "**";
  const date = "\n> " + dateTime;
  const contentDiscord = conTele.concat(reply, date);

  const d1 =
    "https://discord.com/api/webhooks/1101475855638728735/rLHXwrAZBkypV2f6epEnlyGCLPCJORDWep_yw0mzasd-YLZ4wPp5yaT626wNPa1mMpAS";
  const d2 =
    "https://discord.com/api/webhooks/1101475855638728735/rLHXwrAZBkypV2f6epEnlyGCLPCJORDWep_yw0mzasd-YLZ4wPp5yaT626wNPa1mMpAS";
  const d3 =
    "https://discord.com/api/webhooks/1101475855638728735/rLHXwrAZBkypV2f6epEnlyGCLPCJORDWep_yw0mzasd-YLZ4wPp5yaT626wNPa1mMpAS";
  const d4 =
    "https://discord.com/api/webhooks/1101475855638728735/rLHXwrAZBkypV2f6epEnlyGCLPCJORDWep_yw0mzasd-YLZ4wPp5yaT626wNPa1mMpAS";
  const d5 =
    "https://discord.com/api/webhooks/1101475855638728735/rLHXwrAZBkypV2f6epEnlyGCLPCJORDWep_yw0mzasd-YLZ4wPp5yaT626wNPa1mMpAS";

  let items = [d1, d2, d3, d4, d5];
  var item = items[Math.floor(Math.random() * items.length)];
  var params = {
    content: contentDiscord,
  };

  if (messageText == "/start") {
    const griding = "Welcome to Anoderb Bot \nPowered by Anoderb Team";
    bot.sendMessage(chatId, griding);
  } else {
    fetch(item, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      console.log(res);
    });

    bot.sendMessage(chatId, "Sending message successfully");
  }
});
