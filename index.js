
const api = require('./api');
const express = require('express');      
const application= express();
const port = process.env.PORT || 5000;      

application.use(express.json())
application.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 })

application.get('/add', (request, response) =>{
    response.send('The add request resived');
});

application.get('/add2/:n/:m', (request, response) =>{
    let n = Number(request.params.n);
    let m = Number(request.params.m);
    let sum = api.add(n,m);
    response.send(`${n} + ${m} = ${sum}`);
});

application.post('/register', (request, response) =>{
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    if(api.checkCustomer(email,password)==0){
        response.status=307;
        response.sendStatus(response.status);
    }
    else{
        let sum = api.addCustomer(name,email,password);
        //response.send(JSON.stringify(`customer added ${name}`));
        response.send(JSON.stringify(`customer added ${name}`));
    }
    
});

application.post('/login', (request, response) =>{
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    if(api.checkCustomer(email,password)==1){
        response.send(JSON. stringify({"isvalid":true,"message":"customer exist"}));
    }
    else{
        response.send(JSON. stringify({"isvalid":false,"message":"customer not exist"}));
    }

});
application.get('/flowers', (request, response) =>{
    let flowerL = api.getFlowers();
    response.send(JSON. stringify(flowerL));
});
application.get('/quizzes', (request, response) =>{
    let quizs = api.getQuizs();
    response.send(JSON. stringify(quizs));
});

application.get('/quiz/:id', (request, response) =>{
    let quiz = api.getQuizById(request.params.id);
    response.send(JSON. stringify(quiz));
});



application.post('/score', (request, response) =>{
    let quizTaker = request.body.quizTaker;
    let quizId = request.body.quizId;
    let score = request.body.score;
    let date = request.body.date;
    api.addScore(quizTaker,quizId,score,date);
});

application.get('/scores/:quiztaker/:quizid', (request, response) =>{
    let quiztaker = request.body.quiztaker;
    let quizid = request.body.quizid;
    let scoreOfquiz = api.checkScore(quiztaker,quizid);
    response.send(JSON. stringify(scoreOfquiz));
});

application. listen(port, () => console.log('The application is listening to '+port))