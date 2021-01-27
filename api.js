var {customers} = require('./customers');
let add = (n,m) => {
    return n+m;
}



let addCustomer = (name,email, password) => {
    customers.push({name,email, password});
}

exports.add = add;
exports.addCustomer = addCustomer;