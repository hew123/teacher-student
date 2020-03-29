import "reflect-metadata";
import {createConnection} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";

export const findTeacher = async(email:string) =>{

    let connection = await createConnection();
    const teacher = await connection.getRepository(Teacher).findOne(
        {where:{email:email}});
    
    connection.close();
    if(teacher!=null)
        return true;
    else
        return false;
}

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

    return {"students":commonStudents};
}

export const getStudents = async(email:string)=>{

    var students = await getData(email);
    return {"students":students};
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
        if(existing!=null || existing.length!=0){
            var union = students.concat(existing);
            students = union;
        }
        teacher.students = students;
    }

    //connection.manager.save(teacher).then(()=>{connection.close()});
    await connection.manager.save(teacher);
    connection.close();
    console.log("Registered new students under teacher id: " + teacher.email);
}

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