import { MigrationInterface, QueryRunner } from "typeorm";

export class OrdersUpdateUser1710780559299 implements MigrationInterface {
    name = 'OrdersUpdateUser1710780559299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_af818664e8ef7a22906a90919f8"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "updated_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_af818664e8ef7a22906a90919f8" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_af818664e8ef7a22906a90919f8"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "updated_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_af818664e8ef7a22906a90919f8" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
