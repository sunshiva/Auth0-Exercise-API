const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const cors = require('cors');
const connection  = require('express-myconnection');
const mysql = require('mysql');
const request = require('request');
const bodyParser = require("body-parser");
const guard = require('express-jwt-permissions')();

require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());

app.use(cors());

// Validate the access token and enable the use of the jwtCheck middleware
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  // Validate the audience and the issuer
  audience: `${process.env.AUTH0_AUDIENCE}`,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: [ 'RS256' ]
});

// middleware to check scopes
/*const checkPermissions = function (req, res, next) {
  console.log("Path: ", req.path);
  switch (req.path) {
    case '/customers/read': {
      var permission = ['read:custo'];
      if (jwtAuthz(['read:customers'])) {
        next();
      } else {
        res.status(403).send({message: 'Forbidden'});
      }
      break;
    }
      case '/customers/create': {
      var permission = ['create:customers'];
      if (jwtAuthz([permission])) {
        next();
      } else {
        res.status(403).send({message: 'Forbidden'});
      }
      break;
    }
    case '/customers/delete/:id': {
      var permission = ['delete:customers'];
      if (jwtAuthz([permission])) {
        next();
      } else {
        res.status(403).send({message: 'Forbidden'});
      }
    break;
    }
  }
};*/

//app.use(checkPermissions);
app.use(checkJwt);

app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status).send({message:err.message});
    console.log(err);
    return;
  }
  next();
});

app.use(
	    
	    connection(mysql,{
	        
	        host: 'localhost', //'localhost',
	        user: 'root',
	        password : '0MusunD0',
	        port : 3306, //port mysql
	        database:'test'

	    },'pool') //or single

	);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

/*app.use(guard.check('read:customers'), function (err, req, res, next) {
  if (err.name) {
    res.status(401).send('No scope present \'read:customers\'');
  }
});*/

//const checkScopes = jwtAuthz(['read:customers','create:customers','delete:customers']);
//app.use(checkScopes);

/*app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status).send({message:err.message});
    console.log(err);
    return;
  }
  console.log("All scopes available");
  next();
});*/

app.get('/customers/read', checkJwt, jwtAuthz(['read:customers']), function (req, res) {
  
  req.getConnection(function(err, connection) {
    if (err) return next(err);
       
    var query = connection.query('SELECT * FROM customers',function(err,rows) {
        
        if (err) {
           console.log("Error reading: %s ", err.message);
            response.status(400).send('Error in database operation: ', err.mesage);
        } else {
            res.send(rows);
        }
       
     });
     
     console.log(query.sql);
  });

});

app.post('/customers/create', checkJwt, jwtAuthz(['create:customers']), function (req, res) {

  req.getConnection(function(err, connection) {
    if (err) return next(err);

      var input = req.body;
      formData = {
          
        name: input.name,
        address: input.address,
        email: input.email,
        phone: input.phone
    
      };

      console.log("Form Data: ", formData);
      var query = connection.query("INSERT INTO customers set ? ", [formData], function(err, rows) {
            
        if (err) {
           console.log("Error reading: %s ", err.message);
            //response.status(400).send('Error in database operation: ', err.mesage);
        } else {
            res.send(rows);
        }
        console.log(query.sql);
      });   
  });

});

app.get('/customers/delete/:id', checkJwt, jwtAuthz(['delete:customers']), function (req, res) {

  var id = req.params.id;
  console.log("Deleting user id", id);
   
  req.getConnection(function (err, connection) {
     
     var query = connection.query("DELETE FROM customers  WHERE id = ? ", [id], function(err, rows) {
     console.log(query.sql); 
     
     if(err) {
         console.log("Error deleting: %s", err.message );
         //response.status(400).send('Error in database operation: ', err.message);
     } else {
         res.send(rows);
         //res.sendStatus(200);
     }        
          
    });
     
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json(err);
});

app.listen(4300, function () {
	  console.log('Example app listening on port 4300');
	});

module.exports = app;
