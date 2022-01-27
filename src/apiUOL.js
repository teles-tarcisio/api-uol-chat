import express from 'express';
import cors from 'cors';

import { insertUser, getUsers } from './dbServices.js';

const server = express();
server.use(express.json());
server.use(cors());

server.post('/participants', async (req, res) => {
  //
  // validar input antes de conectar ao BD  
  //
  try {
    const newUserPromise = await insertUser(req.body);
    console.log('inserted: ', newUserPromise);
    res.status(201).send("Usuário inserido");

  } catch (error) {
    console.log(error);
    console.log("Erro em 'post /participants'");
    res.sendStatus(500);
  }
});

server.get('/participants', async (req, res) => {
  try {
    const getUsersPromise = await getUsers();
    res.send(getUsersPromise);
  } catch (error) {
    console.log(error);
    console.log("Erro em 'get /participants'");
    res.sendStatus(500);
  }
});

const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`server running, http://localhost:${serverPort}`);
});