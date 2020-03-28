import {Entity, Column, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import {Teacher} from "./Teacher";

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    suspended: boolean;

    @ManyToMany(type => Teacher, teacher => teacher.students)
    teachers: Teacher[];
}