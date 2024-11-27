const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const token = '8180775485:AAGmN1OQA1rIZgAnvnRJVf1A5MyAL9aYq3A';
const GAME_URL = 'https://game.yudiz.com/jet-jumper/';

const bot = new Telegraf(token);
const app = express();
const port = 3026;

app.use(bodyParser.json());

// Handle /start command with referral
bot.command('start', async (ctx) => {
  try {
    // Get the referral code from the start command if it exists
    const startPayload = ctx.message.text.split(' ')[1];

    // Construct the game URL with the referral code using the new format
    const gameUrl = startPayload
      ? `${GAME_URL}?tgWebAppStartParam=${startPayload}`
      : GAME_URL;

    await ctx.replyWithMarkdown(
      `*Jet Jumper*\n\n` +
      `🚀 Steer your spacecraft through space!\n` +
      `⚡ Tap to dodge deadly obstacles.\n` +
      `🏆 Survive and set a distance record!\n` +
      `🌟 Fast-paced and thrilling gameplay.\n` +
      `🌌 How far can you travel?`,
      Markup.inlineKeyboard([
        Markup.button.webApp('START', gameUrl)
      ])
    );
  } catch (error) {
    console.error('Error in start command:', error);
    ctx.reply('Sorry, something went wrong. Please try again.');
  }
});

// Webhook route for Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Set up webhook
const url = 'https://telegrams5.game.webdevprojects.cloud/bot' + token;
bot.telegram.setWebhook(url);