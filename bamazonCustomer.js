var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3307,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('connected');
  table();
});

var table = function () {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log('  ' + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");
    }
    store();
  })
}

function store() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: " Enter the ID of the product you need"
      },
      {
        name: "units",
        type: "input",
        message: " how many units would you like?"
      }

    ])
    .then(function (answer) {
      connection.query("SELECT * FROM bamazon.products WHERE item_id=" + answer.item, function (err, res) {
        if (res === undefined || res.length == 0) {
          console.log('\n item does not exist, please select another \n')

          store()
        } else if (res[0].stock_quantity < answer.units) {
          console.log('Insufficient quantity, select a different amount')
          store()
        }
        else {

          console.log('\n ' + res[0].item_id + " | " + res[0].product_name + " | " + res[0].department_name + " | " + res[0].price + " | " + res[0].stock_quantity + "\n");
          purchase = res[0].stock_quantity - answer.units
          totalCost = answer.units * res[0].price
          buy(answer.item, purchase, totalCost)


        }
      })
    })
}

function buy(ID, amount, total) {
  connection.query("UPDATE bamazon.products SET stock_quantity =" + amount + " WHERE item_id = " + ID, function (err, res) {
    console.log(' your total is $' + total);
    console.log('\n thank your for shopping with us');
  })
  connection.end()
}



