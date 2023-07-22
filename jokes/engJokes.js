const engJokes = [
    (ctx) => {
        const randomJoke = engJokesTable[Math.floor(Math.random() * engJokesTable.length)];
        ctx.reply(randomJoke);
    }
  ];
  
  module.exports = engJokes;