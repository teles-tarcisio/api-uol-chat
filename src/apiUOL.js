import express from 'express';
import cors from 'cors';

import { connectToDB, insertUser, getUsers } from './dbServices.js';

const server = express();
server.use(express.json());
server.use(cors());

server.post('/participants', async (req, res) => {
  //
  // validar input antes de conectar ao BD  
  //
  try {
    
    const userInsertionPromise = await insertUser(req.body);
    console.log('inserted: ', userInsertionPromise);
    res.status(201).send("Usuário inserido");

  } catch (error) {
    console.log(error);
    console.log("Erro em '/post'");
    res.sendStatus(500);
  }
});

server.get('/participants', (req, res) => {
  const dbConnection = mongoClient.connect();

  dbConnection.then(dbLink => {
    const db = dbLink.db('apiUOL');
    const usersCollection = db.collection('users');
    const getUsersPromise = usersCollection.find().toArray();

    getUsersPromise.then(search => res.send(search));
    getUsersPromise.catch(console.log);
  });


  dbConnection.catch(err => {
    console.log('error getting participants', err);
    res.send(err);
  });
});

const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`server running, http://localhost:${serverPort}`);
});