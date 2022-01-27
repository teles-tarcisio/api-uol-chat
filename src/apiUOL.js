import express from 'express';
import cors from 'cors';

import { insertUser, getUsers } from './dbServices.js';
import { checkUserName } from './joiValidations.js';

const server = express();
server.use(express.json());
server.use(cors());

async function isUniqueUser(targetName) {
  try {
    const getUsersPromise = await getUsers();
    const filteredByName = getUsersPromise.filter(user => (
      user.name === targetName
    ));
    console.log(filteredByName);
    return (filteredByName.length > 0);
  } catch (error) {
    console.log(error);
    console.log('Erro buscando usuario por nome');
    return false;
  }
}

server.post('/participants', async (req, res) => {
  const validName = await checkUserName(req.body.name);
  if (validName === undefined) {
    res.status(422).send('Nome inválido, tente novamente\n(sem espaços, 3-14 caracteres alfanuméricos)');
    return;
  }
  else {
    try {
      if (await isUniqueUser(validName)) {
        console.log('já existe usuário com o nome informado');
        res.status(409).send('Já existe usuário com este nome, escolha outro.');
        return;
      }
      else {

        const newUserPromise = await insertUser({ name: validName });
        console.log('inserted: ', newUserPromise);
        res.status(201).send("Usuário inserido");
        return;
      }
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