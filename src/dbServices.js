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
    console.error(error);
    console.error("Erro ao inserir usuário");
  }
};

async function getAllUsers() {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('users');
    
    const usersPromise = await targetCollection.find({}).toArray();
    dbConnection.close();
    return usersPromise;

  } catch (error) {
    console.error(error);
    console.error('Erro ao buscar usuários');
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
    console.error(error);
    console.error("Erro ao inserir nova mensagem");
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
        {type:'message'},
        {from: user },
        { $and:[
          {type:"private_message"},
          {to: user }
          ]
        }
      ]}).toArray();
    dbConnection.close();
    return filteredMessagesPromise;
    
  } catch (error) {
    console.error(error);
    console.error('Erro ao buscar mensagens de/para usuário');
    return error;
  }
}

async function findUserByName(targetName) {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('users');
    const findUserPromise = await targetCollection.find({
      name: targetName,
    }).toArray();
    dbConnection.close();
    return findUserPromise;

  } catch (error) {
    console.error(error);
    console.error('Erro ao buscar usuário por nome');
  }
}

async function updateUserStatus(targetName) {
  try {
    const dbConnection = await connectToDB();
    const db = dbConnection.db('apiUOL');
    const targetCollection = db.collection('users');
    const updatedStatus = await targetCollection.findOneAndUpdate(
      {
      name: targetName
      },
      {
        $set: {
          lastStatus: Date.now()
        }
      }
    );
    dbConnection.close();
    return updatedStatus;

  } catch (error) {
    console.error(error);
    console.error('Erro atualizando status do usuário');
  }
}

export {
  connectToDB,
  insertUser,
  getAllUsers,
  insertMessage,
  getMessages,
  getFilteredMessages,
  findUserByName,
  updateUserStatus,
};
