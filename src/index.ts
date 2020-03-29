import {getStudents, getCommonStudents} from "./get";
import {notifyStudents} from "./notify";
import {suspendStudent} from "./suspend";
import {registerStudents} from "./register";

const express = require('express');
const app = express();

app.use(express.json())


app.post('/api/register', async function(req,res){

    var query = req.body;
    console.log("query: ",query);

    if(query.hasOwnProperty("students") && query.hasOwnProperty("teacher")){
        await registerStudents(query);
        res.status(204).send();
    }
    else
        res.status(400).json({"message":"Request body is either empty or lacking 'students'/'teacher' field!"});
});

app.get('/api/commonstudents', async function(req,res){

    var queryString = req.query.teacher;
    console.log("Query: ", queryString);

    if(queryString!=null && typeof queryString == "string")
        res.status(200).json(await getStudents(queryString));

    else if(queryString!=null && typeof queryString == "object") 
        res.status(200).json(await getCommonStudents(queryString))

    else
        res.status(400).json({"message":"please input an email address!"});
});

app.post('/api/suspend', async function(req,res){

    var query = req.body;
    console.log("query: ",query);

    if(query.hasOwnProperty("student")){
        await suspendStudent(query);
        res.status(204).send();
    }
    else
        res.status(400).json({"message":"Request body is either empty or lacking 'student' field!"});
});

app.post('/api/retrievefornotifications', async function(req,res){

    var query = req.body;
    console.log("query: ",query);

    if(query.hasOwnProperty("teacher") && query.hasOwnProperty("notification"))
        res.status(200).json(await notifyStudents(query));
    else
        res.status(400).json({"message":"Request body is either empty or lacking 'teacher'/'notification' field!"});
});


app.listen(3000,function(){
    console.log('example app listening on port 3000');
});