import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { CoursesService } from './courses.service';

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
    async create(@Body() body: Object) {
        
        this.coursesService.create(body);

        return body;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: object, @Res() res) {
        this.coursesService.update(id, body);

        return res.status(HttpStatus.NO_CONTENT).send();

    }

    @Delete(':id')
    async remove(@Param('id') id, @Res() res) {
        const courses = this.coursesService.remove(id);

        res.status(HttpStatus.OK).send(courses);
    }


}
