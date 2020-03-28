import "reflect-metadata";
import {createConnection, AdvancedConsoleLogger} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";


export const getData = async(email:string) =>{

    let connection = await createConnection();
    const teacher = await connection.getRepository(Teacher).findOne(
        {relations:["students"],where:{email:email}});
    
    connection.close();
    
    if(teacher!=null){
        var students = teacher['students'];
        if(students.length!=0 && students!=null){
            var unwrapped = students.map((student)=>student['email']);
            return unwrapped;
        }
        else
            return [];
    }
    else
        return [];
}

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

    var result = {"students":commonStudents};
    return JSON.stringify(result);
}

export const getStudents = async(email:string)=>{

    var students = await getData(email);
    var result = {"students":students};
    return JSON.stringify(result);
}

export const registerStudents = async(body:object)=>{

    let connection = await createConnection();

    var teacher_query = body['teacher'];
    var students_query = body['students'];

    let students = [];

    var email:string;
    for(email of students_query){

        var student = new Student();
        student.email = email;
        student.suspended = false;

        var find = await connection.getRepository(Student).findOne({where:{email:email}});
        
        if(find==null){
            await connection.manager.save(student);
            console.log("Saved a new student with id: " + student.email);
        }
        students.push(student);
    }
    
    var teacher = await connection.getRepository(Teacher).findOne(
                        {relations:["students"],where:{email:teacher_query}});
    
    if(teacher==null){
        teacher = new Teacher();
        teacher.email = teacher_query;
        teacher.students = students;
        console.log("Saved a new teacher with id: " + teacher.email);
    }
    else{
        var existing = teacher['students'];
        console.log("existing",existing);
        if(existing!=null || existing.length!=0){
            let difference = students.filter((person)=>!existing.includes(person));
            console.log("different",difference);
            let union = difference.concat(existing);
            teacher.students = union;
            console.log("union",union);
        }
        else{
            teacher.students = students;
        }   
    }

    connection.manager.save(teacher).then(()=>{connection.close()});
    
    console.log("Registered new students under teacher id: " + teacher.email);

}
