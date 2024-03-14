import { MigrationInterface, QueryRunner } from "typeorm";

export class Categories1710437008787 implements MigrationInterface {
    name = 'Categories1710437008787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_8e608661a0a051a4158fd1c1393"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "addedById" TO "added_by"`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "added_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_0e52894bd29bf2e61cef73ecca5" FOREIGN KEY ("added_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_0e52894bd29bf2e61cef73ecca5"`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "added_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "added_by" TO "addedById"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_8e608661a0a051a4158fd1c1393" FOREIGN KEY ("addedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
