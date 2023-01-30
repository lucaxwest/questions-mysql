const express = require('express')
const server = express();
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

// Database
connection
    .authenticate()
    .then(()=>{
        console.log('Conexão estabelecida com o banco de dados!')
    })
    .catch((error)=>{
        console.log(error)
    })


server.set('view engine','ejs') // --> Express usa o EJS como View Engine
server.use(express.static('public')) // --> Carrega arquivos estáticos

server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

// Rotas
server.get('/', (req, res)=>{
    Pergunta.findAll({ raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas => {
        res.render('main', {
            perguntas
        })
    })
})

server.get('/perguntar', (req, res)=>{
    res.render('perguntar')
})

server.post("/savepergunta", (req, res)=>{
    const { titulo } = req.body
    const { descricao } = req.body
    Pergunta.create({
        titulo,
        descricao
    }).then(()=>{
        res.redirect('/')
    })
})

server.get('/pergunta/:id', (req, res)=>{
    const { id } = req.params
    Pergunta.findOne({
        where: {id}
    }).then(pergunta => {   
        if (pergunta != undefined) {
            
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas =>{
                res.render('pergunta', {
                    pergunta,
                    respostas
                })
            })
        }else{
            res.redirect('/')
        }
    })
})


server.post("/responder", (req, res)=>{
    const { bodyId } = req.body
    const { perguntaId } = req.body

    Resposta.create({
        bodyId,
        perguntaId
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaId)
    })
})


server.listen(3333, ()=>{
    console.log('Server ON')
})

