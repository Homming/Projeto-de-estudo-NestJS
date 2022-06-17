import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {

    constructor(private readonly coursesService: CoursesService) {

    }

    @Get('List')
    async findAll(@Res() res) {
        const listCourses = await this.coursesService.findAll();
        return res.status(HttpStatus.OK).send(listCourses);
    }

    @Get(':id')
    async findById(@Param('id') id) {
        const element = this.coursesService.findOne(id);
        if (!element) return "Curso não encontrado";

        return element;
    }

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    async create(@Body() createCourseDto: CreateCourseDto) {
        
        this.coursesService.create(createCourseDto);

        return createCourseDto;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Res() res) {
        this.coursesService.update(id, updateCourseDto);

        return res.status(HttpStatus.NO_CONTENT).send();

    }

    @Delete(':id')
    async remove(@Param('id') id, @Res() res) {
        const courses = this.coursesService.remove(id);

        res.status(HttpStatus.OK).send(courses);
    }


}
