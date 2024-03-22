import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductSlugColumnUpdate1711137315273 implements MigrationInterface {
    name = 'ProductSlugColumnUpdate1711137315273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "slug" DROP NOT NULL`);
    }

}
