import express from 'express';
import cors from 'cors';

import { insertUser, getUsers } from './dbServices.js';
import { checkUserName } from './joiValidations.js';

const server = express();
server.use(express.json());
server.use(cors());

server.post('/participants', async (req, res) => {
  const validName = await checkUserName(req.body.name);
  if (validName === undefined) {
    res.status(422).send('Nome inválido, tente novamente\n(sem espaços, 3-14 caracteres alfanuméricos)');
    return;
  }
  else {
    try {
      const newUserPromise = await insertUser({ name: validName });
      console.log('inserted: ', newUserPromise);
      res.status(201).send("Usuário inserido");
      return;
  
    } catch (error) {
      console.log(error);
      console.log("Erro em 'post /participants'");
      res.sendStatus(500);
      return;
    }
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