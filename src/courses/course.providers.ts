import { DataSource } from "typeorm";
import { Course } from "./entities/course.entity";
import { Tags } from "./entities/tags.entity";

export const courseProviders = [
    {
        provide: 'COURSE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Course),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'TAGS_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Tags),
        inject: ['DATA_SOURCE'],
    }
]