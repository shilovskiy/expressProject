'use strict'
/*test url

 PUT /newuser/oleg/123
 PUT /newuser/oleg1/1234
 PUT /newuser/oleg2/1235

GET /readusers

POST /updateusers/oleg/134
DELETE /deluser/oleg2

RPC /rpc
 { "method":"new","name":"firstUser","score":"98"}
 { "method":"new","name":"2User","score":"9"}
 { "method":"get"}
 { "method":"del","name":"firstUser"}
 { "method":"modify","name":"2User","score":"200"}

можно использовать парамеры
limit
fields
offset

 */


var express = require('express');
var bodyParser = require('body-parser');

var user = require('./user');
var usersCollection = require('./userCollection');

var app = express();


var localUserStorage = new usersCollection();


app.all('/',(req,res,next)=>{
    var err = new Error("No found");
err.status = 404;
next(err);


});

//CRUD
//C
app.put('/newuser/:name/:score',(req,res)=>{
    let newU = new user(req.params.name,req.params.score);
    localUserStorage.addItem(newU);
  res.send(`Hello ${JSON.stringify(newU)}`);
});

//R
app.get('/readusers',(req,res)=>{
    res.send(`all users ${JSON.stringify(localUserStorage)}`);
});

//U
app.post('/updateusers/:name/:score',(req,res)=>{
localUserStorage.setUsersScore(req.params.name,req.params.score);
res.send(`Hello ${JSON.stringify(localUserStorage)}`);
});

//D
app.delete('/deluser/:name',(req,res)=>{
    localUserStorage.deleteuser(req.params.name);
res.send(`Hello ${JSON.stringify(localUserStorage)}`);
});

//D
app.delete('/killall',(req,res)=>{
    localUserStorage.killThemAll();
    res.send(`Users ${JSON.stringify(localUserStorage)}`);
});


const RPC={
    new:(req,res,next)=>{
        var name = req.body.name;
        var score = req.body.score;
        if ((name!=undefined)&&(score!=undefined)){
            let newU = new user(name,score);
            localUserStorage.addItem(newU);
            res.send(`Hello ${JSON.stringify(newU)}`);
        }else{
            var err = new Error(`paramaters not found. Yor query must contain name and score`);
            err.status = 500;
            next(err);
        }
    },
    get:(req,res,next)=>{
        var fields = req.query.fields!=undefined?(req.query.fields).split(','):'';
        var offset = (req.query.offset!=undefined &&(req.query.offset>0))?parseInt(req.query.offset):0;
        if (req.query.limit!=undefined){
            if (req.query.fields==undefined) {
                res.send(`${req.query.limit} users ${JSON.stringify(localUserStorage.getNUsers(parseInt(req.query.limit), offset))} of ${localUserStorage.length}`);
            }else{
                res.send(`${req.query.limit} users ${JSON.stringify(localUserStorage.getNUsers(parseInt(req.query.limit), offset),fields)} of ${localUserStorage.length}`);
            }
        }else{
            if (req.query.fields==undefined) {
                res.send(`all users ${JSON.stringify(localUserStorage)}`);
            }else{
                res.send(`all users ${JSON.stringify(localUserStorage, fields)}`);
            }
        }
    },
    modify:(req,res,next)=>{

        var name = req.body.name;
        var score = req.body.score;
        if ((name!=undefined)&&(score!=undefined)){
            localUserStorage.setUsersScore(name,score);
            res.send(`Updated ${JSON.stringify(localUserStorage)}`);
        }else{
            var err = new Error(`paramaters not found. Yor query must contain name and score`);
            err.status = 500;
            next(err);
        }
    },
    del:(req,res,next)=>{
        var name = req.body.name;

        if (name!=undefined){
            localUserStorage.deleteuser(name);
            res.send(`after deletion ${JSON.stringify(localUserStorage)}`);
        }else{
            var err = new Error(`paramaters not found. Yor query must contain name`);
            err.status = 500;
            next(err);
        }

    }
};
app.use( bodyParser.json() );

app.post('/rpc',(req,resp,next)=>{

    var method = req.body.method;
    var func = RPC[method];
    if (func ==undefined) {
        var err = new Error(`method ${method} not found`);
        err.status = 500;
        next(err);
    }else{

        func(req,resp,next);
    }
});
//Err
app.use((err,req,resp,next)=>{
      // render the error page
  resp.status(err.status || 500);
  resp.send(`error ${err.message}`);
});

 module.exports = app;
