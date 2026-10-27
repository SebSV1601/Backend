//npm install express --save
const express = require("express");
//npm install mysql2 --save
const mysql = require("mysql2");
//npm install cors --save
const cors = require("cors");

const app = express();

const port = 3000;

app.use(cors());

//Host, user, password database
const connection = mysql.createConnection({
    //process.env.KEYWORD
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

// Liste over alle pokemon med alle deres stats
app.get('/pokemon', (req, res) =>{
    connection.query('select * from pokemon', (error, result) => {
        res.send(result);
    });
});

// se alle pokemon af en bestemt type man
app.get('/pokemon_type', (req, res) => {
    const type = req.query.type

    connection.query('select * from pokemon where primary_type = ?',
        [type],
        (error, result) => {
            res.send(result)
        });
});

// søge efter pokemon navn
app.get('/pokemon_name',(req, res) => {
    const pokemonName = req.query.name

    connection.query('select * from pokemon where name = ?',
        [pokemonName],
        (error, result)=> {
            res.send(result)
        });
});



app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});