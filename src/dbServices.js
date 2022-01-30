import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

async function connectToDB() {
  try {
    const connection= await mongoClient.connect();
    return connection;
  } catch (error) {
    console.log(error);
    console.log("Erro abrindo conexão com BD");
  }
};

async function insertUser(newUser) {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('users');
    
    const insertionPromise = await targetCollection.insertOne(newUser);
    dbConnection.close();
    return insertionPromise.insertedId;

  } catch (error) {
    console.log(error);
    console.log("Erro ao inserir usuário");
  }
};

async function getUsers() {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('users');
    
    const usersPromise = await targetCollection.find({}).toArray();
    dbConnection.close();
    return usersPromise;

  } catch (error) {
    console.log(error);
    console.log('Erro ao buscar usuários');
  }
};

async function insertMessage(newMessage) {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('messages');

    const messagePromise = await targetCollection.insertOne(newMessage);
    dbConnection.close();
    return messagePromise.insertedId;    

  } catch (error) {
    console.log(error);
    console.log("Erro ao inserir nova mensagem");
  }
};

async function getMessages() {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('messages');

    const messagesPromise = await targetCollection.find({}).toArray();
    dbConnection.close();
    return messagesPromise;

  } catch (error) {
    console.log(error);
    console.log('Erro ao buscar mensagens');
    return;
  }
};

async function getFilteredMessages(user) {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('messages');

    const filteredMessagesPromise = await targetCollection.find({
      $or:[
        {type:"message"},
        { $and:[
          {type:"private_message"},
          {to: user },
          {from: user }
          ]
        }
      ]}).toArray();
    dbConnection.close();
    return filteredMessagesPromise;

  } catch (error) {
    console.log(error);
    console.log('Erro ao buscar mensagens');
    return error;
  }

}

export { connectToDB, insertUser, getUsers, insertMessage, getMessages, getFilteredMessages };



/*
db.messages.find({$or: [{type:'message'}, {$and: [{ type: 'private_message'}, {to: 'ramiro00'}, {from: 'ramiro00'}]} ]})
*/