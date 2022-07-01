import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tags } from "./tags.entity";

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(type => Tags, tags => tags.courses, {
        cascade: true
    })
    @JoinTable()
    tags: Tags[];
}