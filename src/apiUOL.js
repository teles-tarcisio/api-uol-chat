import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

import { insertUser, getUsers, insertMessage } from './dbServices.js';
import { checkUserName, checkMessage } from './joiValidations.js';

const server = express();
server.use(express.json());
server.use(cors());

async function userExists(targetName) {
  const getUsersPromise = await getUsers();
  const filteredByName = getUsersPromise.filter (user => (
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
        console.log('--> passed joi: ', newUserData);
                
        const newUserPromise = await insertUser(newUserData);
        console.log('new user inserted: ', newUserPromise);
        
        const newUserArrived = await logNewUser(newUserData);
        console.log('entrou na sala: ', newUserArrived);
        
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
  }
});

server.post('/messages', async (req, res) => {
  const sender = req.headers.user;
  const testMessage = {
    from: sender, //precisa usar `${ }` ?
    to: req.body.to,
    text: req.body.text,
    type: req.body.type,
    time: dayjs().format("HH:mm:ss")
  }
  console.log('message format: ', testMessage);

  //valid recipient ?
  const isRecipientValid = !(await userExists(testMessage.to));
  console.log('to: ', testMessage.to);
  console.log('recipient exists? ', isRecipientValid);
  if (isRecipientValid) {
    //proceed, check joi

    //insert message in db

    //return as 'success'
    res.sendStatus(501);
  }
  else {
    res.sendStatus(422);
  }
});

const testMessage = {
  from: 'emitente',
  to: 'destinatario',
  text: 'mandano messagi',
  type: 'message',
  time: dayjs().format("HH:mm:ss")
};
console.log('testMessage: ', checkMessage(testMessage));

const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`server running, http://localhost:${serverPort}`);
});