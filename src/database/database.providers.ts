import { CourseRefactoring1656886766729 } from "src/migrations/1656886766729-CourseRefactoring";
import { DataSource } from "typeorm";

require('dotenv').config();


export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: process.env.database_password,
                database: 'nestjs',
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        }
    }
]

export const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: process.env.database_password,
    database: 'nestjs',
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: false,
    migrations: [CourseRefactoring1656886766729],
});

