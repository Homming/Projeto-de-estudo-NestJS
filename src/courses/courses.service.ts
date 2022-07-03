import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { Tags } from './entities/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,

        @InjectRepository(Tags)
        private readonly tagsRepository: Repository<Tags>,
    ) {}

    async findAll() {
        const courses = this.courseRepository.find({
            relations: ['tags'],
        });
        
        return courses;
    }

    findOne(id: string) {
        const course = this.courseRepository.findOne(id, {
            relations: ['tags'],
        });

        if(!course) {
            throw new HttpException(`Course ID ${id} not found`, HttpStatus.NOT_FOUND)
        }

        return course;
    }

    async create(courseDto: CreateCourseDto) {
        // uso de Promise.all() só irá retornar os valores 
        // após todas as promisses tiverem sido resolvidas.
        // fazemos uma HOF para percorrer o array de tags, e utilizamos o método
        // preloadTagByName para verificar se cada tag do array já foi criada ou não.
        const tags = await Promise.all(
            courseDto.tags.map((name) => this.preloadTagByName(name))
        );

        // crio o objeto de acordo com oque foi recebido,
        // faz o spread operator do objeto recebido e adiciona o array tags, já preloadado anteriormente, sobrescrevendo as tags do objeto courseDto
        const course = this.courseRepository.create({
            ...courseDto,
            tags,
        });
        // salvo o mesmo no banco de dados;
        return this.courseRepository.save(course);
    }

    async update(id: string, courseDto: UpdateCourseDto) {
        // faz o mesmo do create, verifica primeiramento se há um campo Tags no objeto, e depois faz o preload de cada uma das tags, verificando se a mesma já foi criada na base ou não.
        const tags = courseDto.tags && (
            await Promise.all(
                courseDto.tags.map((name) => this.preloadTagByName(name))
            )
        )       
        // pré carrega o objeto que iremos atualizar ao encontrar o registro 
        // com o id especificando dentro do objeto do preload
        // sobrescreve o campo tags do objeto, de acordo com a constante que criamos anteriormente utilizanodo o preloadTagByName
        const course = await this.courseRepository.preload({
            id: +id,
            ...courseDto,
            tags
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

    // oque ele encontrar, ele retornar, oque ele não encontrar, ele cria e retorna
    private async preloadTagByName(name: string): Promise<Tags> {
        const tag = await this.tagsRepository.findOne({ name });

        if (tag) {
            return tag;
        }

        return this.tagsRepository.create({ name });
    }
}
