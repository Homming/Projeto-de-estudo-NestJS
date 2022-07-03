import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseRefactoring1656882318657 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE courses RENAME COLUMN course TO name`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE courses RENAME COLUMN name TO course`,
        );
    }

}
