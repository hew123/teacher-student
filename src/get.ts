import "reflect-metadata";
import {createConnection} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";


export const getCommonStudents = async(emails:string[])=>{

    var arrayStudents = emails.map(async(email)=>await getData(email));
    var studentEmails = arrayStudents.filter(async(array) => (await array).length>0);
    var commonStudents = await studentEmails.pop();

    for(var list of studentEmails){
        for(var item of commonStudents){
            var index = commonStudents.indexOf(item);
            if(!((await list).includes(item)))
                commonStudents.splice(index,1);
        }
    }

    return {"students":commonStudents};
}

export const getStudents = async(email:string)=>{

    var students = await getData(email);
    return {"students":students};
}

const getData = async(email:string) =>{

    let connection = await createConnection();
    const teacher = await connection.getRepository(Teacher).findOne(
        {relations:["students"],where:{email:email}});
    
    connection.close();
    
    if(teacher==null)
        return [];
    else{
        var students = teacher['students'];
        if(students.length!=0 && students!=null){
            var unwrapped = students.map((student)=>student['email']);
            return unwrapped;
        }
    }
    return [];
}