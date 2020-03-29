import "reflect-metadata";
import {createConnection} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";


export const notifyStudents = async(body:object) =>{

    var teacher_email = body['teacher'];
    var notification = body['notification'];
    var splitted = notification.split('@');
    var studentEmails = [];
    if(splitted.length>1){
        for(var i=1;i<splitted.length;i=i+2){
            if(i+1<splitted.length){
                var temp = splitted[i] + '@' + splitted[i+1];
                temp = temp.replace(/\s+/g, '');
                studentEmails.push(temp);
            }
        }
    }

    let connection = await createConnection();

    const teacher = await connection.getRepository(Teacher).findOne(
        {relations:["students"],where:{email:teacher_email}});
        
    if(teacher!=null){
        var students = teacher['students'];
        if(students.length!=0 && students!=null){
            var unwrapped = students.map((student)=>student['email']);
            for(var item of unwrapped){
                if(!(studentEmails.includes(item)))
                    studentEmails.push(item)
            }
        }
    }

    var toRemoved = [];
    for(var email of studentEmails){
        var found = await connection.getRepository(Student).findOne({where:{email:email}});
        if(found==null)
            toRemoved.push(email);
        else{
            if(found.suspended==true)
                toRemoved.push(email);
        }
    }
    studentEmails = studentEmails.filter((item) => !((toRemoved).includes(item)));

    connection.close();

   return {"recipients":studentEmails};
}