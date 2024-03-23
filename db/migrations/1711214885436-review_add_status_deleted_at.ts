import { MigrationInterface, QueryRunner } from "typeorm";

export class ReviewAddStatusDeletedAt1711214885436 implements MigrationInterface {
    name = 'ReviewAddStatusDeletedAt1711214885436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."review_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "review" ADD "status" "public"."review_status_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "review" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."review_status_enum"`);
    }

}
