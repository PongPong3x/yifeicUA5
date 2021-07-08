var {flowers} = require('./flowers');
const { Pool } = require('pg');
const fs = require('fs');
const { quizzes } = require('./data');

require('dotenv').config();
let create_db_structure_sql = fs.readFileSync('db.sql').toString();
const connectionString = `postgres://liknsyvyppedoj:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;
const connection={
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL: connectionString,
    ssl: {rejectUnauthorized: false}
}
const pool = new Pool(connection);
let getInsertFlowersSql = () => {
    let sql = "";
    sql = `insert into imagequiz.flower(name, picture) values `;
    let values = [];
    for (flower of flowers) {
      values.push(`('${flower.name}', '${flower.picture}')`);
    }
    sql += values.join(", ");
    return sql;
  };


let getInsertQuizzesSql = (categoryId) => {
    let sql = '';
    for (var i = 0; i < quizzes.length; i++) {
        console.log(quizzes[i]);
        sql += getInsertQuizSql(categoryId, quizzes[i])
    }
    /*
    for(quiz of quizzes) {
        console.log(quiz);
       sql += getInsertQuizSql(categoryId, quiz)
    }
    */
    return sql;
}
let getInsertQuizSql = (categoryId, quiz) => {
    let sql = '';
    sql = `with quizid${quiz.id} as 
        (insert into imagequiz.quiz(name, category_id) values ('${quiz.name}', ${categoryId}) returning id )
        , questionsid${quiz.id} as 
        (insert into imagequiz.question(picture, choices, answer) values `;
    let values = [];
    for (question of quiz.questions) {
        values.push(`('${question.picture}', '${question.choices}', '${question.answer}')`);
    }
    sql += values.join(', ');
    sql += ' returning id )';
    sql += ` insert into imagequiz.quiz_question select (select id from quizid${quiz.id}), b.id from questionsid${quiz.id} b;`;
    //console.log(sql);
    return sql;
}
pool.query(create_db_structure_sql)
    .then(x => console.log('The database tables created successfully.'))
    .catch(e => {
        console.log("error in creating the table")
        console.log(e);})
    .then(() => pool.query('insert into imagequiz.category(name) values ($1) returning id', ['flowers']))
    .then(x => pool.query(getInsertQuizzesSql(x.rows[0].id)))
    .then(x => console.log('The quizzes were inserted into the database.'))
    .catch(e => console.log(e)) 
    //.then(() => {for (var i = 0; i < flowers.length; i++) {pool.query('insert into imagequiz.flower(name,picture) values ($1,$2)',[flowers[i].name,flowers[i].picture]);}})
    .then((x) => pool.query(getInsertFlowersSql()))
    .then((x) => console.log("Flowers were succesfully added."))
    .catch((e) => console.log(e));
    
