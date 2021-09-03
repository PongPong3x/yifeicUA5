
const api = require('./api');
const sql_api = require('./sql_api');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const application= express();
const port = process.env.PORT || 5000;      

application.use(express.json());
application.use(cors());

application.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.header("Cache-Control","no-cache");
    next();
})
     //response.header("Access-Control-Allow-Origin", "*");
    //response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //response.setHeader("Cache-Control","no-cache");
    //response.setHeader("Access-Control-Allow-Origin", "*");
    //response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

passport.use(new LocalStrategy(
{ usernameField: 'email' },
(email, password, done) => {
    console.log('Inside local strategy callback');     
    sql_api.checkCustomer(email, password)
        .then(x => {
            x.json();
            console.log(x);
            let user = { id: x.rows[0].id, name: x.rows[0].name, email: email };
            console.log(user);
            return done(null, user);
        })
        .catch(e => {
            console.log('The email or password is not valid.');
            return done(null, false, 'The email or password was invalid');
        });
}
));

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
   console.log('Inside deserializeUser callback')
   console.log(`The user id passport saved in the session file store is: ${id}`)
   const user = {id: id}; 
   done(null, user);
});

application.use(session({
    genid: (request) => {
       //console.log(request); 
       console.log('Inside session middleware genid function')
       console.log(`Request object sessionID from client: ${request.sessionID}`)
 
       return uuid(); // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'some random string',
    resave: false,
    saveUninitialized: true
 }));
 application.use(passport.initialize());
 application.use(passport.session());





application.get('/add', (request, response) =>{
    response.send('The add request resived');
});

application.get('/add2/:n/:m', (request, response) =>{
    if(request.isAuthenticated()) {
        let n = Number(request.params.n);
        let m = Number(request.params.m);
        let sum = api.add(n, m);
        response.send(`${n} + ${m} = ${sum}`);
     } else {
        response.status(401).json({done: false, message: 'Please sign in first.'});
     }
     /*
    let n = Number(request.params.n);
    let m = Number(request.params.m);
    let sum = api.add(n,m);
    response.send(`${n} + ${m} = ${sum}`);
    */
});

application.post('/register', (request, response) =>{

    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    sql_api.setCustomer(name,email,password)
    .then(x => {
        //response.status(200).json({message: 'The customer added'});
        localStorage.setItem('customer',email);
        response.json({message: 'The customer added'});
    })
    .catch(e => {
        console.log(e);
        //response.sendStatus(403);
        response.json({message: 'A customer with the same email already exists.'});
    })
});


application.get('/login', (req, res) => {
    console.log('Inside GET /login callback')
    console.log(req.sessionID)
    res.send(`You got the login page!\n`)
})

/*
application.post('/login', (request, response) =>{
    //let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    sql_api.checkCustomer(email,password)
    .then(x => {
        response.json({isvalid:"true",message:"customer exist"});
    })
    .catch(e => {console.log(e);
        response.json({isvalid:"false", message:"customer not exist"});
    })
});
*/

application.post('/login', (request, response, next) => {
    console.log('Inside POST /login callback')
    passport.authenticate('local', (err, user, info) => {
      console.log('Inside passport.authenticate() callback');
      console.log(`req.session.passport: ${JSON.stringify(request.session.passport)}`);
      console.log(`req.user: ${JSON.stringify(request.user)}`);
      request.login(user, (err) => {
        console.log('Inside req.login() callback')
        console.log(`req.session.passport: ${JSON.stringify(request.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(request.user)}`)
        return response.json({ done: true, message: 'The customer logged in.' });;
      })
    })(request, response, next);   
 });




application.get('/customer', (request, response) =>{
    sql_api.getAllCustomer()
        .then(x => {
            console.log(x);
            response.json(x);})
        .catch(e => {
            console.log(e);
            response.status(500).json({message: 'error in get all customer: '+e});
        })
    
});

application.get('/flowers', (request, response) =>{
    sql_api.getFlowers()
    .then(x => {
        console.log(x);
        response.json(x);
    })
});

application.get('/quizzes', (request, response) =>{
    if(request.isAuthenticated()) {
        sql_api.getQuizs()
        .then(x => {
            console.log(x);
            response.json(x);
        })
    }else{
        response.status(401).json({done: false, message: 'Please sign in first.'});
    }
});

application.get('/quiz/:name', (request, response) =>{
    if(request.isAuthenticated()) {
        sql_api.getQuizById(request.params.name)
        .then(x => {
            console.log(x);
            response.json(x);
        })
    }else{
        response.status(401).json({done: false, message: 'Please sign in first.'});
    }
});

application.post('/score', (request, response) =>{
    let quizTaker = request.body.quizTaker;
    let quizId = request.body.quizName;
    let score = request.body.score;
    //let date = request.body.date;
    sql_api.addScore(quizTaker,quizId,score)
    .then(x => {
        console.log(x);
        response.json({message:"update successful"});
    })
    .catch(e => {
        console.log(e);
        //response.sendStatus(403);
        response.json({message: 'error: '+e});
    })

});

application.get('/scores/:quiztaker/:quizid', (request, response) =>{
    let quiztaker = request.params.quiztaker;
    let quizid = request.params.quizid;
    console.log(quizid);
    //let scoreOfquiz = sql_api.checkScore(quiztaker,quizid);
    //response.json(JSON.parse(scoreOfquiz));
    //response.send(JSON. stringify(scoreOfquiz));
    sql_api.checkScore(quiztaker,quizid)
    .then(x => {
        console.log(x);
        response.json(x);
    })
    .catch(e => {
        console.log(e);
        //response.sendStatus(403);
        response.json({message: 'error: '+e});
    })

});

application. listen(port, () => console.log('The application is listening to '+port))

