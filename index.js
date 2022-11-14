//Configururação inicial
require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const jwt = require('jsonwebtoken');
//Ler JSON --Middlewares

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(cors())
app.use(express.json());
//Rotas da API
const personRoutes = require('./routes/personRoutes')
app.use('/person', personRoutes);
//Rota inicial / Endpoint
app.get('/', (req, res) => {
    //Mostra requisição
    res.json({
        message: "Oi Express!"
    })
});

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.zslyq.mongodb.net/?retryWrites=true&w=majority`,
).then(() => {
    console.log("Conectado ao mongodb");
    app.listen(3000);
}).catch(err => {
    console.log('Deu erro');
    console.log(err);
})