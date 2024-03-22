import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductAddSlug1711135452086 implements MigrationInterface {
    name = 'ProductAddSlug1711135452086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "slug" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "slug"`);
    }

}
