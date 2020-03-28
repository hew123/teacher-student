import "reflect-metadata";
import {createConnection} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";


export const getData = async(email:string) =>{

    let connection = await createConnection();
    const obj = await connection
        .getRepository(Teacher)
        .findOne({
            //select:[],
            relations:["students"],
            where:{
                email:email
            }
        });

    connection.close();

    var students = [];
    if(obj!=null)
        return obj['students'];
    else
        return [];
}

export const getCommonStudents = async(emails:string[])=>{

    var arrayStudents = emails.map(async(email)=>await getData(email));
    var commonStudents = await arrayStudents[0];
    for(var i=1;i<arrayStudents.length;i++)
        commonStudents = commonStudents.filter(async(student) => (await arrayStudents[i]).includes(student));
    
    var unwrapped = [];
    if(commonStudents.length!=0)
        unwrapped = commonStudents.map((student)=>student['email']);

    var result = {"students":unwrapped};
    return JSON.stringify(result);
}

export const getStudents = async(email:string)=>{

    var students = await getData(email);
    var unwrapped = [];
    if(students.length!=0)
        unwrapped = students.map((student)=>student['email']);

    var result = {"students":unwrapped};
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
            await connection.getRepository(Student).save(student);
            console.log("Saved a new student with id: " + student.email);
        }
        students.push(student);
    }
    
    var teacher = await connection.getRepository(Teacher).findOne({where:{email:teacher_query}});
    if(teacher==null){
        teacher = new Teacher();
        teacher.email = teacher_query;
        console.log("Saved a new teacher with id: " + teacher.email);
    }
    teacher.students = students;
    await connection.getRepository(Teacher).save(teacher);
    console.log("Registered new students under teacher id: " + teacher.email);

    connection.close();
    return true;
}
