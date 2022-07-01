import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from './course.entity'

@Entity('tags')
export class Tags {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToMany(type => Course, course => course.tags)
    courses: Course[];
}