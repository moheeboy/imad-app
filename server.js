var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var session = require('express-session');
var app = express();
var config={
    host: "db.imad.hasura-app.io",
    user: "mohitnikumbh66",
     password: "db-mohitnikumbh66-5779",
    database: "mohitnikumbh66",
   
    //port: "5432",
   
}
app.use(morgan('combined'));

var pool = new Pool(config);
app.get('/test-db', function (req, res){
    pool.query("SELECT * FROM test", function (err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

function createTemplate(data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    var htmlTemplate = `
    <html>
        <head>
            <title>
            ${title}
            </title>
        </haed>
        <body>
        <center>
            <div id="heading">
                <h2>    ${heading}  </h2>
            <span id="date">
                <h3><right>    ${date.toDateString()}   </right></h3>
            </span>
            </div>
            <div id="main">
                <p> ${content}  </p>
            </div>
        <center>
        </body>
        
    </html>
    `
    return htmlTemplate;
    }

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/articles/articleOne', function (req, res){
    pool.query("SELECT * FROM dbArticle WHERE title = 'article-one'" , function(err, result){
       if(err){
            res.status(500).send(err.toString());
       }else{
           if(result.rows.length === 0 ){
               res.status(404).send('Article not found!');
           }else{
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
    });
    
});

app.get('/articles/articleTwo', function (req, res){
    pool.query("SELECT * FROM dbArticle WHERE title = 'articleTwo'" , function(err, result){
       if(err){
            res.status(500).send(err.toString());
       }else{
           if(result.rows.length === 0 ){
               res.status(404).send('Article not found!');
           }else{
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
    });
    
});

app.get('/articles/articleThree', function (req, res){
    pool.query("SELECT * FROM dbArticle WHERE title = 'articleThree'" , function(err, result){
       if(err){
            res.status(500).send(err.toString());
       }else{
           if(result.rows.length === 0 ){
               res.status(404).send('Article not found!');
           }else{
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
    });
    
});

app.get('/articleTwo', function (req, res){
  res.sendFile(path.join(__dirname, 'ui', 'articleTwo.html'));
});

app.get('/articleThree', function (req, res){
  res.sendFile(path.join(__dirname, 'ui', 'articleThree.html'));
});

function hash(input, salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return hashed.toString('hex');
}

app.get('/hash/:input', function (req, res){
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.get('/createUser', function(req,res){
    var username = "mohitnik96";
    var password = "Mohit!1966";
    var salt = "This-is-again-a-random-string";
    var hashedPassword = hash(password, salt);
    pool.query("INSERT INTO dbuser(username, password) VALUES($1,$2)", [username, hashedPassword], function(err, result){
        if(err){
            res.status(500).send(err.toString());
       }else{
           res.send("User Sucessfully Created");
       }
    });
});

app.post('/verifyUser', function(req, res){
    var username = req.params.un;
    var password = req.params.pass;
    var salt = "This-is-again-a-random-string";
    pool.query("SELECT * FROM dbuser WHERE username = '" + username +"'" , function(err, result){
    if(err){
        res.status(500).send(err.toString());
    }else{
        if (res.rows.length === 0 ){
          res.status(403).send("No such user found"); 
        }else{
           var hashedPassword = hash(password, salt);
           var dbPassword = result.rows[0].password;
           if(hashedPassword === dbPassword){
               res.send("UN and Pass both matched!");
           }else{
               res.send("Only username matched, no password!");
                }
            }   
        }
   });
      
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
