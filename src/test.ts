import "reflect-metadata";
import {createConnection} from "typeorm";
import {Teacher} from "./entity/Teacher";
import {Student} from "./entity/Student";

createConnection().then(async connection => {

    const student1 = new Student();
    student1.email = "student1@gmail.com";
    student1.suspended = false;
    const student2 = new Student();
    student2.email = "student2@gmail.com";
    student2.suspended = false;
    await connection.manager.save(student1);
    await connection.manager.save(student2);
    console.log("Saved a new user with id: " + student1.email);
    console.log("Saved a new user with id: " + student2.email);

    console.log("Inserting a new user into the database...");
    const teacher = new Teacher();
    teacher.email = "Timber@gmail.com";
    teacher.students = [student1, student2];
    await connection.manager.save(teacher);
    console.log("Saved a new user with id: " + teacher.email);

    console.log("Loading data from the database...");
    //const result = await connection.manager.find(Teacher);
    //console.log("Loaded users: ", result);

    const result = await connection
    .getRepository(Teacher)
    .findOne(1, { relations: ["students"] });

    console.log("Loaded users: ", result);

}).catch(error => console.log(error));
