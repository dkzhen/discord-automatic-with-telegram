const fetch = require("cross-fetch");
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

//middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();
//endpoint
app.get("/", (req, res) => {
  res.send("its work now! Bot server is running....");
});

console.log("Test Aplication");
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

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

  const d1 = process.env.DISCORD1;
  // const d2 = process.env.DISCORD2;
  // const d3 = process.env.DISCORD3;
  // const d4 = process.env.DISCORD4;
  // const d5 = process.env.DISCORD5;

  // let items = [d1, d2, d3, d4, d5];
  // var item = items[Math.floor(Math.random() * items.length)];
  var params = {
    content: contentDiscord,
  };
  if (messageText === "/start") {
    bot.sendMessage(chatId, "Welcome to Anoderb Bot \nPowered by Anoderb Team");
  } else {
    try {
      (async () => {
        try {
          await fetch(d1, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(params),
          }).then((res) => {
            console.log(res);
          });
        } catch (err) {
          console.error(err);
        }
      })();

      bot.sendMessage(chatId, "Sending message successfull");
    } catch (error) {
      console.error(error);
    }
  }
});
bot.on("polling_error", (error) => {
  console.log(error.code); // => 'EFATAL'
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("App started on Port " + PORT);
});
