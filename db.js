//const e = require('express');
const bcrypt = require('bcrypt');
const {Pool} = require('pg'); 
require('dotenv').config();
//const connectionString = `postgres://:@:5432/d8gceaqrtfr7m5`;
const connectionString = `postgres://liknsyvyppedoj:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;
const connection={
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL: connectionString,
    ssl: {rejectUnauthorized: false}
}
const pool = new Pool(connection);

//1. customer: id, name, email, password (note: never save the actual password into the database. You should always encrypt the password and save the hashed password.)
let getAllCustomer= () =>{
    return pool.query('select * from imagequiz.customer')
    .then(x => x.rows);
   // .catch(e => console.log(e));
}

let setCustomer = (name,email,password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    return pool.query('insert into imagequiz.customer(name,email,password) values ($1,$2,$3)',
    [name,email.toLowerCase(),hashPassword]);
}

let checkCustomer = (email,password) =>{
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    return pool.query('select * from imagequiz.customer where (email = $1 and password = $2)',
    [email.toLowerCase(),hashPassword]);
}
//3. category: id, name




//2. question: id, picture, choices, answer
//4. quiz: id, name, category_id

let getQuizs = () =>{
    return pool.query('select * from imagequiz.quiz')
    .then(x => x.rows);
}

let getQuizById = (id) =>{
    return pool.query('select * from imagequiz.quiz where id = $1',[id]);
}
//5. quiz_question: quiz_id, question_id




//6. flower: id, name, picture
let getFlowers= () =>{
    //pool.query('');
    //pool.query('drop table if exists imagequiz.flower; create table imagequiz.flower(id bigserial primary key,name text not null,picture text not null);');
    //for (var i = 0; i < flowers.length; i++) {
    //    pool.query('create table if not exists imagequiz.flower(id bigserial primary key,name text not null,picture text not null);');
    //    pool.query('insert into imagequiz.flower(name,picture) values ($1,$2)',[flowers[i].name,flowers[i].picture]);
    //}
    return pool.query('select * from imagequiz.flower')
    .then(x => x.rows);
   // .catch(e => console.log(e));
}


let addScore = (quizTaker,quizId, score) => {
    //scores.push({quizTaker,quizId,score});
    return pool.query('select * from imagequiz.customer where email like $1',[quizTaker.toLowerCase()])
    .then(x => pool.query('insert into imagequiz.score(customer_id,quiz_id,score,date) values ($1,$2,$3,$4)',[x.rows[0].id,quizId,score,1]).then(x => x.rows));
    //return pool.query('insert into imagequiz.score(customer_id,quiz_id,score) values ($1,$2,$3)',
    //[quizTaker,quizId,score]);
}


let checkScore = (quiztaker,quizid) => {
    return pool.query('select * from imagequiz.customer where email like $1',[quiztaker.toLowerCase()])
    .then(x => pool.query('select score from imagequiz.score where (customer_id = $1 and quiz_id = $2)',[x.rows[0].id,quizid]).then(x => x.rows));
}



exports.getAllCustomer = getAllCustomer;
exports.setCustomer = setCustomer;
exports.checkCustomer = checkCustomer;
exports.getFlowers = getFlowers;
exports.getQuizs = getQuizs;
exports.getQuizById = getQuizById;
exports.addScore = addScore;
exports.checkScore = checkScore;