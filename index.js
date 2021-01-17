
const api = require('./api');
const express = require('express');      
const application= express();
const port =3000;      

application.get('/add', (request, response) =>{
    response.send('The add request resived');
});

application.get('/add2/:n/:m', (request, response) =>{
    let n = Number(request.params.n);
    let m = Number(request.params.m);
    let sum = api.add(n,m);
    response.send(`${n} + ${m} = ${sum}`);
});
application. listen(port, () => console.log('The application is listening to '+port))