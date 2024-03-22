import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductAddStatusAndDeletedAt1711134494164 implements MigrationInterface {
    name = 'ProductAddStatusAndDeletedAt1711134494164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "status" "public"."product_status_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
    }

}
