var {customers} = require('./customers');
var {flowers} = require('./flowers');
var {quizzes} = require('./data');
var {scores} = require('./scores');
let add = (n,m) => {
    return n+m;
}

let checkCustomer = (email, password) => {
    for (var i = 0; i < customers.length; i++) {
        if(customers[i].email == email){
            if(customers[i].password != password){
                return 2;
            }
            return 1;
        }
    }
    return 0;
}

let addCustomer = (name,email, password) => {
    customers.push({name,email, password});
}


let getFlowers = () => {
    let flowerL=[];
    for (var i = 0; i < flowers.length; i++) {
        flowerL.push(flowers[i].name);
    }
    return flowerL;
}


let getQuizs = () => {
    return quizzes;
}

let getQuizById = (id) => {
    for (var i = 0; i < quizzes.length; i++) {
        for(var j = 0; j < quizzes[i].length; j++){
            if(quizzes[i][j].name == id){
                return quizzes[i][j];
            }
        }
    }
}

let addScore = (quizTaker,quizId, score,date) => {
    scores.push({quizTaker,quizId, score,date});
}


let checkScore = (quiztaker,quizid) => {
    for (var i = 0; i < scores.length; i++) {
        if(scores[i].quizTaker == quiztaker && scores[i].quizId == quizId){
            return scores[i].score;
        }
    }
    return "0";
}

exports.add = add;
exports.addCustomer = addCustomer;
exports.checkCustomer = checkCustomer;
exports.getFlowers = getFlowers;
exports.getQuizs = getQuizs;
exports.getQuizById = getQuizById;
exports.addScore = addScore;
exports.checkScore = checkScore;