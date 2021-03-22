const e = require('express');
const bcrypt = require('bcrypt');
const {Pool} = require('pg');
const connectionString = `postgres://liknsyvyppedoj:fcfe71e1f7cf8408f9dfc9b3cdee82ab1056a6fee41ea6a0e6c626ce435cff7e@ec2-54-161-238-249.compute-1.amazonaws.com:5432/d8gceaqrtfr7m5`;

const connection={
    connectionString: connectionString,
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
    const salt = bcrypt.genSaltSync(9);
    const hashPassword = bcrypt.hashSync(password, salt);
    return pool.query('insert into imagequiz.customer(name,email,password) values ($1,$2,$3)',
    [name,email.toLowerCase(),hashPassword]);
}

let checkCustomer = (email,password) =>{
    const salt = bcrypt.genSaltSync(9);
    const hashPassword = bcrypt.hashSync(password, salt);
    return pool.query('select * from imagequiz.customer where email = $1 and password = $2',
    [email.toLowerCase(),hashPassword]);
}
//3. category: id, name




//2. question: id, picture, choices, answer
//4. quiz: id, name, category_id

let getQuizs = (quizzes) =>{
    pool.query('drop table if exists imagequiz.quiz; create table imagequiz.quiz(id int primary key,name text not null,category_id int not null);');
    pool.query('drop table if exists imagequiz.quiz_question; create table imagequiz.quiz_question(quiz_id int primary key,question_id bigserial not null);');
    for (var i = 0; i < quizzes.length; i++) {
        pool.query('create table if not exists imagequiz.quiz(id int primary key,name text not null,category_id int not null);');
        pool.query('insert into imagequiz.quiz(id,name,category_id) values ($1,$2,$3)',[quizzes[i].id,quizzes[i].name],1);
        for(var j = 0; j < quizzes[i].length; j++){
            if(quizzes[i][j].name == id){
                pool.query('create table if not exists imagequiz.quiz_question(quiz_id int primary key,question_id bigserial not null);');
                pool.query('insert into imagequiz.quiz_question(quiz_id,question_id) values ($1)',[quizzes[i].id]);
            }
        }
    }
    return pool.query('select * from imagequiz.quiz')
    .then(x => x.rows);
}

let getQuizById = (id) =>{
    return pool.query('select * from imagequiz.quiz where id = $1',[id]);
}
//5. quiz_question: quiz_id, question_id




//6. flower: id, name, picture
let getFlowers= (flowers) =>{
    //pool.query('');
    pool.query('drop table if exists imagequiz.flower; create table imagequiz.flower(id bigserial primary key,name text not null,picture text not null);');
    for (var i = 0; i < flowers.length; i++) {
        pool.query('create table if not exists imagequiz.flower(id bigserial primary key,name text not null,picture text not null);');
        pool.query('insert into imagequiz.flower(name,picture) values ($1,$2)',[flowers[i].name,flowers[i].picture]);
    }
    return pool.query('select * from imagequiz.flower')
    .then(x => x.rows);
   // .catch(e => console.log(e));
}


exports.getAllCustomer = getAllCustomer;
exports.setCustomer = setCustomer;
exports.checkCustomer = checkCustomer;
exports.getFlowers = getFlowers;
exports.getQuizs = getQuizs;
exports.getQuizById = getQuizById;