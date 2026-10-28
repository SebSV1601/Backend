//npm install express --save
const express = require("express");
//npm install mysql2 --save
const mysql = require("mysql2");
//npm install cors --save
const cors = require("cors");

const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

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
    connection.query('select * from pokemon',
        (error, result) => {
        res.send(result);
    });
});

// se alle pokemon af en bestemt type man
app.get('/pokemon/type', (req, res) => {
    const type = req.query.type

    connection.query('select * from pokemon where primary_type = ?',
        [type],
        (error, result) => {
            res.send(result)
        });
});

// søge efter pokemon navn
app.get('/pokemon/name',(req, res) => {
    const pokemonName = req.query.name

    connection.query('select * from pokemon where name = ?',
        [pokemonName],
        (error, result)=> {
            res.send(result)
        });
});

// Se en liste over alle trainers.
app.get('/trainers', (req, res) => {
    connection.query('select * from trainer',
        (error, result) => {
        res.send(result)
    });
});

// Se hvilke Pokémon en bestemt trainer ejer.
app.get('/trainer/owner', (req, res) => {
    connection.query(`select trainer_name, name from trainer_pokemon 
                    inner join trainer
                    on trainer_pokemon.trainer_id = trainer.trainer_id
                    inner join pokemon
                    on trainer_pokemon.pokedex_number = pokemon.pokedex_number`,
        (error, result) => {
        res.send(result)
        });
});

// Oprette en ny trainer.
app.post("/trainer/new/", (req, res) => {
        const trainer_name = req.body.trainer_name
        const hometown = req.body.hometown
        const age = req.body.age

        connection.query(
            "INSERT INTO trainer (trainer_name, hometown, age) VALUES (?, ?, ?)",
            [trainer_name, hometown, age],
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send("Trainer could not be generated");
                }
                res.status(201).send(" Trainer was created");
            });
});

app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});