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
    const newUserPromise = usersCollection.insertOne(req.body);

    newUserPromise.then(insertion => res.send(insertion));
    newUserPromise.catch(console.log);

  });
  
  dbConnection.catch(console.log);
});

const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`server running, http://localhost:${serverPort}`);
});