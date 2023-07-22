const { Telegraf, session } = require('telegraf');
const { MongoClient } = require('mongodb');
const { Configuration, OpenAIApi} = require('openai');
require('dotenv').config();

const { help } = require('./module');
const { ruJokes } = require('./jokes/jokes');
const { ruRiddles, ruHandleUserAnswer } = require('./riddles/riddles');
const { processUserInput } = require('./chatGPT/textGPT')

const bot = new Telegraf(process.env.BOT_TOKEN);
const configuration = new Configuration({
    apiKey: process.env.GPT_TOKEN
});
const openai = new OpenAIApi(configuration);
const client = new MongoClient(process.env.MONGO_URL);
bot.use(session());

// Функция для сохранения данных в MongoDB
async function connectToDatabase() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

connectToDatabase();

const jokesCollection = client.db('RiddleJoke').collection('jokesData');

bot.start((ctx) => {
  ctx.reply('Привет! Я бот для развлечений. Введите команду, чтобы начать.');
});

bot.hears(/^\*([\s\S]*)/, async (ctx) => {
        const chatId = ctx.chat.id;
        const input = ctx.message.text.slice(1);

        console.log(input);
    
        const response = await openai.createCompletion({
          model: 'gpt-3.5-turbo',
          prompt: input,
          temperature: 0.7,
          max_tokens: 100,
        });
    
        const res = response.data.choices[0].text;
        ctx.reply(res);
});

bot.hears(/^-/, (ctx) => {
    const message = ctx.message.text;
    
    if (message === '-шутка') {
      ruJokes(ctx);
    } else if (message === '-загадка') {
      ruRiddles(ctx);
    } else if (/--(.+)/.test(message)) {
      ruHandleUserAnswer(ctx);
    } else if (message === '-помощь') {
      ctx.reply(help);
    } else if (message === '-addjoke') {
        ctx.reply('Введите шутку, заключенную в одинарные кавычки, чтобы добавить ее.');

        bot.hears(/^'([\s\S]*)'$/, async (ctx) => {
            const joke = ctx.match[1];

            // Сохранение шутки в базе данных
            await jokesCollection.insertOne({ joke });
        
            ctx.reply('Шутка успешно добавлена!');
        });
    }
  });

// Добавьте обработчики для других команд, например, загадки, игры и т. д.

bot.launch();
