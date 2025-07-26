import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompositeTokenPrimaryKey1752686842000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // The default name for a primary key constraint in PostgreSQL is "table_name_pkey".
    // We'll drop the existing primary key constraint on the 'tokens' table.
    await queryRunner.query(`
      ALTER TABLE "tokens" DROP CONSTRAINT "tokens_pkey" CASCADE
    `);

    // Now, we'll add a new composite primary key on 'address' and 'network'.
    await queryRunner.query(`
      ALTER TABLE "tokens" ADD PRIMARY KEY ("address", "network")
    `);

    // Re-create the foreign key in "creator_donations" to reference the new composite primary key
    await queryRunner.query(`                                                                                                       
      ALTER TABLE "creator_donations"                                                                                               
      ADD CONSTRAINT "FK_donations_to_tokens"                                                                                       
      FOREIGN KEY ("token_address", "network")                                                                                      
      REFERENCES "tokens"("address", "network")                                                                                     
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // To reverse the migration, we first drop the new composite foreign key from "creator_donations"
    await queryRunner.query(
      `ALTER TABLE "creator_donations" DROP CONSTRAINT "FK_donations_to_tokens"`,
    );

    // Drop the composite primary key from "tokens"
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "tokens_pkey"`,
    );

    // Re-add the original single-column primary key to "tokens"
    await queryRunner.query(`ALTER TABLE "tokens" ADD PRIMARY KEY ("address")`);

    // Re-add the original foreign key to "creator_donations"
    await queryRunner.query(`                                                                                                       
      ALTER TABLE "creator_donations"                                                                                               
      ADD CONSTRAINT "FK_donations_to_tokens_old"                                                                                   
      FOREIGN KEY ("token_address")                                                                                                 
      REFERENCES "tokens"("address")                                                                                                
    `);
  }
}
