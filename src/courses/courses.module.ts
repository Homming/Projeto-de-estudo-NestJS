import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Tags } from './entities/tags.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course, Tags])],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CoursesModule {}
