const express = require('express');
const router = express.Router();

/*
 * GET users listing.
 */

exports.read = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM customers',function(err,rows) {
            
            if(err) {
           		console.log("Error reading: %s ", err);
            		response.status(400).send('Error in database operation');
            } else {
                res.send(rows);
            }
           
         });
         
         console.log(query.sql);
    });
  
};

/*exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers - Node.js"});
};*/



/*Save the customer*/
exports.create = function(req,res){
    
    var input = req.body;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
        };
        
        var query = connection.query("INSERT INTO customers set ? ", data, function(err, rows)
        {
  
          if (err) {
         		console.log("Error writing: %s", err);
              	response.status(400).send('Error in database operation');
          } else {
        	  		res.send(rows);
          }
          
        });
        
       console.log(query.sql);
    
    });
};

exports.delete = function(req,res){
    
    var id = req.params.id;
   
    req.getConnection(function (err, connection) {
       
       var query = connection.query("DELETE FROM customers  WHERE id = ? ", [id], function(err, rows) {
       console.log(query.sql); 
       
       if(err) {
       		console.log("Error deleting: %s", err );
       } else {
       		res.send(rows);
       		//res.sendStatus(200);
       }
          
            
       });
       
    });
};

module.exports = router;





