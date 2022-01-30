import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

import { insertUser, getUsers, insertMessage, getMessages } from './dbServices.js';
import { checkUserName, checkMessage, checkLimitedMessages } from './joiValidations.js';

const server = express();
server.use(express.json());
server.use(cors());

async function userExists(targetName) {
  const getUsersPromise = await getUsers();
  const filteredByName = getUsersPromise.filter(user => (
    user.name === targetName)
  );
  if (filteredByName.length > 0) {
    return false;
  }
  else {
    return true;
  }
}

async function logNewUser(newUserData) {
  const userArrival = {
    from: newUserData.name,
    to: 'Todos',
    text: 'entra na sala...',
    type: 'status',
    time: dayjs(newUserData.lastStatus).format("HH:mm:ss")
  };

  try {
    const newUserMessage = await insertMessage(userArrival);
    return newUserMessage;
  } catch (error) {
    console.log(error);
    console.log("Erro inserindo msg userArrived");
  }
}


server.post('/participants', async (req, res) => {
  const validName = checkUserName(req.body);
  if (validName.error !== undefined) {
    console.log('joi error -> username', validName.error.details[0].type);
    res.status(422).send('Nome inválido, tente novamente\n(sem espaços, 3-14 caracteres alfanuméricos)');
    return;
  }
  else {
    try {
      if (!await userExists(validName.value.name)) {
        res.status(409).send('Já existe usuário com este nome, escolha outro.');
        return;
      }
      else {
        const newUserData = {
          name: validName.value.name,
          lastStatus: Date.now()
        };
        
        const newUserPromise = await insertUser(newUserData);
        console.log('new user inserted: ', newUserPromise);

        const newUserArrived = await logNewUser(newUserData);
        console.log('msg entrou na sala: ', newUserArrived);

        res.sendStatus(201);
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
    return;
  }
});

server.post('/messages', async (req, res) => {
  const sender = req.headers.user;
  const uncheckedMessage = {
    from: sender,
    to: req.body.to,
    text: req.body.text,
    type: req.body.type,
    time: dayjs().format("HH:mm:ss")
  }
  
  const isSenderValid = !(await userExists(sender));
  if (!isSenderValid) {
    console.log('Erro -> emitente não existe.');
    res.sendStatus(422);
    return;
  }
  
  const isMessageValid = checkMessage(uncheckedMessage);
  if (isMessageValid.error !== undefined) {
    console.log(' --> ', isMessageValid.error.details[0].type);
    res.sendStatus(422);
    return;
  }

  try {
    const newMessagePosted = await insertMessage(isMessageValid.value);
    console.log('mensagem postada: ', newMessagePosted);
    res.sendStatus(201);
    return;

  } catch (error) {
    console.log('Erro db postar mensagem', error);
    res.sendStatus(422);
    return;
  }
});

server.get('/messages', async (req, res) => {
  console.log(checkLimitedMessages(req.query));
  
  res.sendStatus(501);
  
  /*
  try {
    const getMessagesPromise = await getMessages(limit);

    res.status(201).send(getMessagesPromise));
    
  } catch (error) {
    console.log("Erro em 'get /messages'");
    res.sendStatus(500);
    return;
  }
  */
});


const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`server running, http://localhost:${serverPort}`);
});