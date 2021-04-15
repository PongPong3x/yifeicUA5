const { Pool } = require('pg');
const fs = require('fs');
const { quizzes } = require('./data');
var {flowers} = require('./flowers');
let create_db_structure_sql = fs.readFileSync('db.sql').toString();
const connectionString =
    `postgres://liknsyvyppedoj:fcfe71e1f7cf8408f9dfc9b3cdee82ab1056a6fee41ea6a0e6c626ce435cff7e@ec2-54-161-238-249.compute-1.amazonaws.com:5432/d8gceaqrtfr7m5`;
const connection = {
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
}
const pool = new Pool(connection);
let getInsertQuizzesSql = (categoryId) => {
    let sql = '';
    for(quiz of quizzes) {
       sql += getInsertQuizSql(categoryId, quiz)
    }
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
    console.log(sql);
    return sql;
}
pool.query(create_db_structure_sql)
    .then(x => console.log('The database tables created successfully.'))
    .catch(e => console.log(e))
    .then(() => pool.query('insert into imagequiz.category(name) values ($1) returning id', ['flowers']))
    .then(x => pool.query(getInsertQuizzesSql(x.rows[0].id)))
    .then(x => console.log('The quizzes were inserted into the database.'))
    .catch(e => console.log(e)) 
    .then(() => {for (var i = 0; i < flowers.length; i++) {pool.query('insert into imagequiz.flower(name,picture) values ($1,$2)',[flowers[i].name,flowers[i].picture]);}})
    
