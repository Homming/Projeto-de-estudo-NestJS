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

    async create(courseDto: CreateCourseDto) {
        
        const tags = await Promise.all(
            courseDto.tags.map((name) => this.preloadTagByName(name))
        )

        const course = this.courseRepository.create({
            ...courseDto,
            tags,
        });

        return this.courseRepository.save(course);
    }

    async update(id: string, courseDto: UpdateCourseDto) {
        
        const tags = courseDto.tags && (await Promise.all(
            courseDto.tags.map((name) => this.preloadTagByName(name))
        ));

        const course = await this.courseRepository.preload({
            id: +id,
            ...courseDto,
            tags,
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

    private async preloadTagByName(name: string): Promise<Tags> {
        const tag = await this.tagRepository.findOne({ where: { name } });

        if (tag) return tag;

        return this.tagRepository.create({ name });
    }
}
