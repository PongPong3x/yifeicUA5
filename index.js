
const api = require('./api');
const express = require('express');      
const application= express();
const port =4002;      


application.get('/add', (request, resonse) =>{
    resonse.send('The add request resived');
});

application.get('/add2/:n/:m', (request, resonse) =>{
    let n = Number(request.params.n);
    let m = Number(request.params.m);
    let sum = api.add(n,m);
    resonse.send(`${n} + ${m} = ${sum}`);
});
//application. listen(port, () => console.log('The application is listening to '+port))