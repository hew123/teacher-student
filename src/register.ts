import "reflect-metadata";
import {createConnection} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";

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
        if(existing!=null || existing.length!=0){
            var union = students.concat(existing);
            students = union;
        }
        teacher.students = students;
    }

    await connection.manager.save(teacher);
    connection.close();
    console.log("Registered new students under teacher id: " + teacher.email);
}
