const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
// Telegram Bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
// Discord webhook URL

const webhookAirdrop = [process.env.DISCORD1, process.env.DISCORD2];
const webhookTestnet = [process.env.DISCORD1, process.env.DISCORD2];
const webhookNodes = [process.env.DISCORD1, process.env.DISCORD2];

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });
let messageText,
  dateTime,
  sender = "";
let webhookIndex = 0;

// Command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Welcome to Anoderb Bot \nPowered by Anoderb Team");
});
bot.onText(/\/testnet/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Please enter your message:", {
    reply_markup: {
      force_reply: true,
    },
  });
});

bot.onText(/\/nodes/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Please enter your message:", {
    reply_markup: {
      force_reply: true,
    },
  });
});

let promptText = "";

// Message handler
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case "/start":
    case "/testnet":
    case "/nodes":
      // Skip handling the command itself
      promptText = text;
      break;
    default:
      if (
        msg.reply_to_message &&
        msg.reply_to_message.text === "Please enter your message:"
      ) {
        chatCommand(msg, dateTime, messageText, sender, chatId);
        break;
      }
      chatAll(msg, dateTime, messageText, sender, chatId);
      promptText = "";
      break;
  }
});

// Start the bot
bot.on("polling_error", (error) => {
  console.error(error);
});
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
const chatAll = (msg, dateTime, messageText, sender, chatId) => {
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
  // Send the message to the Discord webhook
  bot.sendMessage(chatId, "Your message has been send to Airdrop!");
  axios.post(webhookAirdrop[webhookIndex], { content: contentDiscord });
  webhookIndex = (webhookIndex + 1) % webhookAirdrop.length; // Move to the next webhook URL in the array
};
const chatCommand = (msg, dateTime, messageText, sender, chatId) => {
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
  // Reply to the prompt with the user's message

  let channel = promptText.substr(1);
  bot.sendMessage(chatId, `Your message has been to #news-${channel} !`);
  switch (promptText) {
    case "/testnet":
      axios.post(webhookTestnet[webhookIndex], { content: contentDiscord });
      webhookIndex = (webhookIndex + 1) % webhookTestnet.length;
      break;
    case "/nodes":
      axios.post(webhookNodes[webhookIndex], { content: contentDiscord });
      webhookIndex = (webhookIndex + 1) % webhookNodes.length;
      break;

    default:
      axios.post(webhookAirdrop[webhookIndex], { content: contentDiscord });
      webhookIndex = (webhookIndex + 1) % webhookAirdrop.length;
      break;
  }
};
