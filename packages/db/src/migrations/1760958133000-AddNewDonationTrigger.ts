import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewDonationTrigger1760958133000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION notify_new_donation() RETURNS trigger AS $$
      DECLARE
        payload JSON;
      BEGIN
        payload = json_build_object('id', NEW.id);
        PERFORM pg_notify('new_donation', payload::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_new_donation_token ON creator_token_donations;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_new_donation_nft ON creator_nft_donations;`,
    );

    await queryRunner.query(`
      CREATE TRIGGER trigger_new_donation_token
      AFTER INSERT ON creator_token_donations
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_donation();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_new_donation_nft
      AFTER INSERT ON creator_nft_donations
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_donation();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_new_donation_token ON creator_token_donations;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_new_donation_nft ON creator_nft_donations;`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS notify_new_donation;`);
  }
}
