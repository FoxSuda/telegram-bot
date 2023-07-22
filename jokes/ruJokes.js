const { getJokes } = require('../module');

const ruJokes =
    (ctx) => {
      const randomJoke = getJokes[Math.floor(Math.random() * getJokes.length)];
      ctx.reply(randomJoke);
    };
  
module.exports = {
    ruJokes
};
  