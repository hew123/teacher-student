import {getData, getStudents, getCommonStudents, registerStudents} from "./query";

const express = require('express');
const app = express();


app.use(express.json())

app.get('/api/commonstudents', async function(req,res){

    var queryString = req.query.teacher;
    console.log("Query: ", queryString);
    
    if(queryString == null)
        res.status(400).send("please input an email address!")
    else{     
        var result;

        if (typeof queryString == "string"){
            result = await getStudents(queryString);
        }
        else{
            //if queryString is string[]
            result = await getCommonStudents(queryString);
        }

        res.status(200).send(result);
    }
});

app.post('/api/register', async function(req,res){

    var query = req.body;
    console.log("query: ",query);
    if(JSON.stringify(query)==JSON.stringify({})){
        res.status(400).send("Please enter something in POST body in json");
    }else{
        await registerStudents(query);
        res.status(204).send("done");
    }
});

app.listen(3000,function(){
    console.log('example app listening on port 3000');
});