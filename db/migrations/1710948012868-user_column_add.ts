import { MigrationInterface, QueryRunner } from "typeorm";

export class UserColumnAdd1710948012868 implements MigrationInterface {
    name = 'UserColumnAdd1710948012868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb"`);
        await queryRunner.query(`ALTER TABLE "orders_products" ALTER COLUMN "order_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders_products" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1"`);
        await queryRunner.query(`ALTER TABLE "orders_products" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders_products" ALTER COLUMN "order_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    }

}
