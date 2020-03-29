import "reflect-metadata";
import {createConnection} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";

export const suspendStudent = async(body:object) =>{

    var email = body['student'];
    let connection = await createConnection();
    const student = await connection.getRepository(Student).findOne(
        {where:{email:email}});
    

    if(student!=null){
        student.suspended = true;
        await connection.getRepository(Student).save(student);
    }
    connection.close();
}