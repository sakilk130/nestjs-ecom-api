import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryAddStatusAndDeletedAt1711133182063 implements MigrationInterface {
    name = 'CategoryAddStatusAndDeletedAt1711133182063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."category_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "category" ADD "status" "public"."category_status_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "category" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."category_status_enum"`);
    }

}
