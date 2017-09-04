var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
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
    pool.query("SELECT * FROM dbArticle WHERE title = 'articleOne'" , function(err, result){
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
