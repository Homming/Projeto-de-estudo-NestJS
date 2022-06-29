import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async findAll() {
        const courses = this.courseRepository.find();
        
        return courses;
    }

    findOne(id: string) {
        const course = this.courseRepository.findOne(id);

        if(!course) {
            throw new HttpException(`Course ID ${id} not found`, HttpStatus.NOT_FOUND)
        }

        return course;
    }

    create(courseDto: CreateCourseDto) {
        //crio o objeto de acordo com oque foi recebido
        const course = this.courseRepository.create(courseDto);
        // salvo o mesmo no banco de dados;
        return this.courseRepository.save(course);
    }

    async update(id: string, courseDto: UpdateCourseDto) {
        // pré carrega o objeto que iremos atualizar ao encontrar o registro 
        // com o id especificando dentro do objeto do preload
        const course = await this.courseRepository.preload({
            id: +id,
            ...courseDto,
        });
        
        if (!course) {
            throw new HttpException(`Course ID ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return this.courseRepository.save(course);
    }

    async remove(id: string) {
        const course = await this.courseRepository.findOne(id);

        if (!course) {
            throw new HttpException(`Course ID ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return this.courseRepository.remove(course);
    }
}
