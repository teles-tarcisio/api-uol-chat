import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

async function connectToDB() {
  try {
    return await mongoClient.connect();    
  } catch (error) {
    console.log(error);
    console.log("Erro abrindo conexão com BD");
  }
}

async function insertUser(targetCollection, newUser) {
  try {
    const insertionPromise = await targetCollection.insertOne(
      { 
        name: newUser.name,
        lastStatus: Date.now()
      });
    return insertionPromise.insertedId;
  } catch (error) {
    console.log(error);
    console.log("Erro ao inserir usuário");
  }
}



export { connectToDB, insertUser };