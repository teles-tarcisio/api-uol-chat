import express from 'express';
import cors from 'cors';

import { connectToDB, insertUser } from './dbServices.js';

const server = express();
server.use(express.json());
server.use(cors());

server.post('/participants', async (req, res) => {
  //
  // validar input antes de conectar ao BD  
  //
  try {
    const dbConnection = await connectToDB();
    console.log('connected to database ->', dbConnection.s.url);

    const db = dbConnection.db('apiUOL');
    const usersCollection = db.collection('users');
    console.log('inserted: ', await insertUser(usersCollection, req.body))


    dbConnection.close();
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