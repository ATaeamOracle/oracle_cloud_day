const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'admin',
      database : 'postgres'
    }
  });

const app = express();

app.use(bodyParser.json());

//Get all session and time start
app.get ('/tracks/sessions', (req, res) => {
    const { name, timestart } = req.params;
    db.select('name','timestart').from('sessions')
        .then(session => {    
            if (session.length) {    
                res.json(session)
            } else {
            res.status(400).json('Not found')
            }
    })
    .catch(err => res.status(400).json('Error getting sessions'))
})


//Get all the sessions by TrackID
app.get('/tracks/:track_id', (req,res) =>{
    const { track_id } = req.params;
    db.select('*').from('sessions').where({track_id})
        .then(session => {
            if (session.length) {    
                res.json(session)
            } else {
            res.status(400).json('Not found')
            }
    })
    .catch(err => res.status(400).json('Error getting tracks'))
})

//Post all question by username and question
app.post('/askquestion', (req, res) => {
    const { username, question } = req.body;
    db('questions')
    .returning('*')
    .insert({
        username: username,
        question: question,
    })
    .then(question =>{
        res.json(question[0]);
    })
    .catch(err => res.status(400).json('Unable to ask question'))
})

app.listen(3000, ()=>{
    console.log('App is running on port 3000');
})