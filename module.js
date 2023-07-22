const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URL);

// Функция для получения загадок из базы данных
async function getRiddles() {
  try {
    await client.connect();
    const database = client.db('RiddleJoke');
    const collection = database.collection('riddlesData');

    const riddles = await collection.find().toArray();
    return riddles;
  } catch (error) {
    console.error('Error retrieving riddles from MongoDB:', error);
    return [];
  } finally {
    client.close();
  }
}

// Функция для получения шуток из базы данных
async function getJokes() {
  try {
    await client.connect();
    const database = client.db('RiddleJoke');
    const collection = database.collection('jokesData');

    const jokes = await collection.find().toArray();
    return jokes;
  } catch (error) {
    console.error('Error retrieving jokes from MongoDB:', error);
    return [];
  } finally {
    client.close();
  }
}

  const help = "Команды бота:" + 
               "\n-помощь - выдает все команды бота" + 
               "\n-шутка - выдает одну рандомную шутку" + 
               "\n-загадка - выдает одну рандомную загадку";
  
  module.exports = { getRiddles, getJokes, help };