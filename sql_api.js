var {flowers} = require('./flowers');
var {quizzes} = require('./data');
var {scores} = require('./scores');
const db = require('./db');




/*
let addScore = (quizTaker,quizId, score) => {
    scores.push({quizTaker,quizId,score});
}


let checkScore = (quiztaker,quizid) => {
    for (var i = 0; i < scores.length; i++) {
        if(scores[i].quizTaker == quiztaker && scores[i].quizId == quizId){
            console.log(scores[i].score);
            return scores[i].score;
        }
    }
    return "0";
}
*/


let addScore = (quizTaker,quizId, score) => {
    return db.addScore(quizTaker,quizId, score);
    //scores.push({quizTaker,quizId,score});
}
let checkScore = (quiztaker,quizid) => {
    return db.checkScore(quiztaker,quizid);
}

let getAllCustomer= () =>{
    return db.getAllCustomer();
}


let setCustomer = (name,email,password) => {
    return db.setCustomer(name,email,password);
}

let checkCustomer = (email,password) => {
    return db.checkCustomer(email,password);
}


let getFlowers = () => {
    return db.getFlowers();
}

let getQuizs= () =>{
    return db.getQuizs();
}

let getQuizById = (id) => {
    return db.getQuizById(id);
}

exports.getFlowers = getFlowers;
exports.getQuizs = getQuizs;
exports.getQuizById = getQuizById;
exports.addScore = addScore;
exports.checkScore = checkScore;
exports.getAllCustomer = getAllCustomer;
exports.setCustomer = setCustomer;
exports.checkCustomer = checkCustomer;