import {Entity, Column, PrimaryColumn, ManyToMany} from "typeorm";
import {Teacher} from "./Teacher";

@Entity()
export class Student {

    @PrimaryColumn()
    email: string;

    @Column()
    suspended: boolean;

    @ManyToMany(type => Teacher, teacher => teacher.students)
    teachers: Teacher[];
}