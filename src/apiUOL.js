import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const server = express();
server.use(express.json());
server.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

server.post('/participants', (req, res) => {
  const dbConnection = mongoClient.connect();

  dbConnection.then( dbLink => {
    console.log('connected to db ->', dbLink.s.url);
    const db = dbLink.db('apiUOL');
    const usersCollection = db.collection('users');
    const newUserPromise = usersCollection.insertOne({name: req.body.name, lastStatus: Date.now() });

    newUserPromise.then(insertion => res.send(insertion));
    newUserPromise.catch(console.log);
  });
  
  dbConnection.catch(err => {
    console.log('error posting participant', err);
    res.send(err);
  });
});

server.get('/participants', (req, res) => {
  const dbConnection = mongoClient.connect();

  dbConnection.then( dbLink => {
    const db = dbLink.db('apiUOL');
    const usersCollection = db.collection('users');
    const getUsersPromise = usersCollection.find().toArray();

    getUsersPromise.then( search => res.send(search));
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