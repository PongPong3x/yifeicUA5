var {customers} = require('./customers');
let add = (n,m) => {
    return n+m;
}

let checkCustomer = (name,email, password) => {
    for (var i = 0; i < customers.length; i++) {
        if(customers[i].name == name &&customers[i].email == email &&customers[i].password == password  ){
            return 1;
        }
    }
    return 0;
}

let addCustomer = (name,email, password) => {
    customers.push({name,email, password});
}

exports.add = add;
exports.addCustomer = addCustomer;
exports.checkCustomer = checkCustomer;