/**
 * JWT usage example
 * Steps
 * 1) Sign data with 30s expiry in our case is `user` object. look `login` route
 * 2) add middleware for checking if request have authorization tokens. look `ensureToken` function
 * 3) verify JWT and print data else set status code to 403 
 */

var express = require('express');
var jwt = require('jsonwebtoken');
const app = express();
app.get("/",function(require,response){
    response.json({
        text:"Hello"
    });
})
app.post("/api/login",function(req,res)
{
    const user = {id:3}
    const token = jwt.sign({user},'my_secret_key',{expiresIn:'30s'});
    res.json({token:token})
})
app.get("/api/protected",ensureToken,function(req,res)
{
    jwt.verify(req.token,'my_secret_key',function(err,data)
{
    if(err)
    {
        res.sendStatus(403);
    }else{
        res.json({
            text:'this is protected',
            data:data
        })
    }
})
    
})
app.listen(3000,function(){
    console.log("App listening on port 3000");
})

function ensureToken(req,res,next){
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}