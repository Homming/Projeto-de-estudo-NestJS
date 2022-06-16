import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import * as fs from 'node:fs/promises';

@Injectable()
export class CoursesService {
    private courses: Course[];

    constructor() {
        fs.readFile('./cursos.json', "utf8")
            .then(data => { 
                this.courses = JSON.parse(data) 
            });
    }

    async findAll() {
        return this.courses;
    }

    findOne(id: string) {
        const course = this.courses.find(item => item.id === Number(id));

        if(!course) {
            throw new HttpException(`Course ID ${id} not found`, HttpStatus.NOT_FOUND)
        }

        return course;
    }

    create(courseDto: any) {
        const entries = Object.keys(this.courses[0]);
        for(let i = 0; i < entries.length; i += 1) {
            if (!Object.prototype.hasOwnProperty.call(courseDto, entries[i])) {
                throw new HttpException("Falta de Dados na criação do objeto", HttpStatus.BAD_REQUEST);
            }
        }

        this.courses.push(courseDto);
        fs.writeFile('./cursos.json', JSON.stringify(this.courses));

        return this.courses;
    }

    async update(id: string, courseDto: any) {
        const keys = Object.keys(courseDto);

        const itemToUpdate = this.courses.find(item => item.id === Number(id))
        //if (!itemToUpdate) throw new CustomException(HttpStatus.NOT_FOUND, "Curso não encontrado");

        keys.forEach(key => itemToUpdate[key] = courseDto[key]);
        this.courses.splice((Number(id)-1), 1, itemToUpdate);

        await fs.writeFile('./cursos.json', JSON.stringify(this.courses));

        return null;
    }

    async remove(id: string) {
        //if(Number(id) > this.courses.length || Number(id) <= 0) throw new CustomException(HttpStatus.NOT_FOUND, "id inválido");

        const courseFilter = this.courses.filter(element => element.id != Number(id));

        await fs.writeFile('./cursos.json', JSON.stringify(courseFilter));

        return this.courses;
    }
}
