import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import {Student} from "./Student";

@Entity()
export class Teacher {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @ManyToMany(type => Student, student => student.teachers)
    @JoinTable()
    students: Student[];

}
