const { riddles } = require('../module');

const engRiddles = [
    async (ctx) => {
        const randomRiddle = engRiddlesTable[Math.floor(Math.random() * engRiddlesTable.length)];
      
        await ctx.reply(randomRiddle.question);
        await ctx.reply("You have 1 minute to answer. Reply with -eng- followed by your answer to participate.");
      
        session.riddle = randomRiddle; // Save the current riddle in the user's session
        setTimeout(async () => {
          if (session.riddle) {
            await ctx.reply(`Time's up! The correct answer is: ${randomRiddle.answer}`);
            delete session.riddle;
          }
        }, 60000); // Delay of 60,000 milliseconds (1 minute)
    }
];

const engHandleUserAnswer = (ctx) => {
    const userAnswer = ctx.match[1].trim(); // Get the user's answer and remove extra spaces
    const currentRiddle = session.riddle; // Get the current riddle from the user's session
      
    if (currentRiddle && userAnswer.toLowerCase() === currentRiddle.answer.toLowerCase()) {
      clearTimeout(session.riddleTimer); // Cancel the timer for the current riddle
      const winnerName = ctx.from.first_name || ctx.from.username || 'Anonymous User';
      ctx.reply(`Congratulations, ${winnerName}! The correct answer is: ${currentRiddle.answer}`);
      delete session.riddle; // Remove the riddle from the user's session
    }
};
  
module.exports = { engRiddles, engHandleUserAnswer};