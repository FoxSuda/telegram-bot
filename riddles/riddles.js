const { session } = require('telegraf');
const { getRiddles } = require('../module');

const ruRiddles =
    async (ctx) => {
        const randomRiddle = getRiddles[Math.floor(Math.random() * getRiddles.length)];
  
        await ctx.reply(randomRiddle.question);
        await ctx.reply("Ответ будет через 1 минуту. Отвечайте через -ru- чтобы ваш ответ был учтен");
  
        session.riddle = randomRiddle; // Сохраняем текущую загадку в сессии пользователя
        setTimeout(async () => {
            if (session.riddle) {
                await ctx.reply(`Время истекло! Правильный ответ: ${randomRiddle.answer}`);
                delete session.riddle;
            }
        }, 60000); // Задержка в 60 000 миллисекунд (1 минута)
    };

  const ruHandleUserAnswer = (ctx) => {
    const match = ctx.match && ctx.match[1]; // Проверяем, что сопоставление существует и содержит вторую группу
    const userAnswer = match ? match.trim() : ''; // Если сопоставление существует, получаем ответ пользователя и удаляем лишние пробелы, иначе устанавливаем пустую строку
    const currentRiddle = session.riddle; // Получаем текущую загадку из сессии пользователя
  
    if (currentRiddle && userAnswer.toLowerCase() === currentRiddle.answer.toLowerCase()) {
      clearTimeout(session.riddleTimer); // Отменяем таймер для текущей загадки
      const winnerName = ctx.from.first_name || ctx.from.username || 'Анонимный пользователь';
      ctx.reply(`Поздравляю, ${winnerName}! Правильный ответ: ${currentRiddle.answer}`);
      delete session.riddle; // Удаляем загадку из сессии пользователя
    }
  };
  
  module.exports = { ruRiddles, ruHandleUserAnswer };
