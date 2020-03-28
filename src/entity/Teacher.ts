import {Entity, PrimaryColumn, Column, ManyToMany, JoinTable} from "typeorm";
import {Student} from "./Student";

@Entity()
export class Teacher {

    @PrimaryColumn()
    email: string;

    @ManyToMany(type => Student, student => student.teachers)
    @JoinTable()
    students: Student[];

}
