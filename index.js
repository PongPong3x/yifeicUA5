
const api = require('./api');
const express = require('express');      
const application= express();
const port = process.env.PORT || 5000;      

application.use(express.json())

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
    if(api.checkCustomer(name,email,password)==0){
        response.status=307;
        response.sendStatus(response.status);
    }
    else{
        let sum = api.addCustomer(name,email,password);
        response.send(JSON.stringify(`customer added ${name}`));
    }
    
});

application. listen(port, () => console.log('The application is listening to '+port))