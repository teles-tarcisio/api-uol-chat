import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

import {
  insertUser,
  getAllUsers,
  insertMessage,
  getFilteredMessages,
  findUserByName,
  updateUserStatus,
} from './dbServices.js';
import {
  checkUserName,
  checkMessage,
} from './joiValidations.js';

const server = express();
server.use(express.json());
server.use(cors());

async function userExists(targetName) {
  const getUserPromise = await findUserByName(targetName);
  if (getUserPromise.length > 0) {
    return true;
  }
  else {
    return false;
  }
};

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
};


server.post('/participants', async (req, res) => {
  const userNickname = checkUserName(req.body);
  console.log(userNickname);
  if (userNickname.error !== undefined) {
    console.log('joi error, username: ', userNickname.error.details[0].type);
    return res.status(422).send('Nome inválido, tente novamente\n(sem espaços/acentos, 3-16 caracteres alfanuméricos)');
  }
  else {
    const userName = userNickname.value.name;
    try {
      if (!await userExists(userName)) {
        return res.status(409).send('Já existe usuário com este nome, escolha outro.');
      }
      else {
        const newUserData = {
          name: userName,
          lastStatus: Date.now()
        };

        await insertUser(newUserData);
        
        await logNewUser(newUserData);
        
        return res.sendStatus(201);
      }

    } catch (error) {
      console.log(error);
      console.log("Erro em 'post /participants'");
      return res.sendStatus(500);
    }
  }
});

server.get('/participants', async (req, res) => {
  try {
    const getUsersPromise = await getAllUsers();
    return res.send(getUsersPromise);
  } catch (error) {
    console.error(error);
    console.error("Erro em 'get /participants'");
    return res.sendStatus(500);
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

  const isSenderExistent = await userExists(sender);
  if (!isSenderExistent) {
    console.error('Erro -> emitente não existe.');
    return res.sendStatus(422);
  }

  const validatedMessage = checkMessage(uncheckedMessage);
  if (validatedMessage.error !== undefined) {
    console.error(' --> ', validatedMessage.error.details[0].type);
    return res.sendStatus(422);
  }

  try {
    await insertMessage(validatedMessage.value);
    return res.sendStatus(201);

  } catch (error) {
    console.error('Erro db postar mensagem', error);
    return res.sendStatus(422);
  }
});

server.get('/messages', async (req, res) => {
  try {
    const targetUser = req.headers.user;
    const limit = req.query?.limit;
    const filteredMessagesArray = await getFilteredMessages(req.headers.user);
    
    if (limit === null || limit === undefined || limit === '') {
      return res.status(201).send(filteredMessagesArray);
    }
    else {
      const numberedLimit = parseInt(limit);
      const limitedMessages = filteredMessagesArray.slice(-numberedLimit);
      return res.status(201).send(limitedMessages);
    }
  } catch (error) {
    console.error("Erro em 'get /messages'");
    console.error(error);
    return res.sendStatus(500);
  }
});

server.post('/status', async (req, res) => {
  const targetUser = req.headers?.user;
  const isUserExistent = await userExists(targetUser);
  
  if (targetUser === null || targetUser === undefined || targetUser === '' || !isUserExistent) {
    console.log('usuario nao consta na lista de participantes!');
    return res.sendStatus(404);
  }

  await updateUserStatus(targetUser);
  return res.sendStatus(200);
});


const serverPort = 5000;
server.listen(serverPort, () => {
  console.log(`Server running, http://localhost:${serverPort}`);
});