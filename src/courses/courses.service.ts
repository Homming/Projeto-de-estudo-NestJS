import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Tags } from './entities/tags.entity';

@Injectable()
export class CoursesService {

    constructor(
        @Inject('COURSE_REPOSITORY')
        private readonly courseRepository: Repository<Course>,

        @Inject('TAGS_REPOSITORY')
        private readonly tagRepository: Repository<Tags>,
    ) {}

    async findAll() {
        const courses = await this.courseRepository.find();
        
        return courses;
    }

    async findOne(id: number) {
        const course = await this.courseRepository.findOne({ where: { id } });

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

    async remove(id: number) {
        const course = await this.courseRepository.findOne({ where: { id } });

        if (!course) {
            throw new HttpException(`Course ID ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return this.courseRepository.remove(course);
    }
}
