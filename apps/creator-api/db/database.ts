import { DataSource } from 'typeorm';
import {
  Creator,
  Donation,
  DonationEffect,
  DonationParameters,
  CreatorNetwork,
  CreatorToken,
  Token,
  User,
  Referral,
  CreatorAddress,
} from './entities';
import {
  AddAmountRaw1743181200000,
  AddDonationEffects1747686797772,
  AddTokenDecimals1743177600000,
  InitialMigration1743173000000,
  RestructureDonations1743174000000,
  AddCreatorProfileEntities1747843796640,
  AddDynamicId1748284091728,
  RefactorMuteToggles1748346009915,
  AddCreatorDisplayName1748521986209,
  AddBadWords1748967010401,
  RenameDynamicIdToPrivyId1749000000000,
  AddTokenName1752155170000,
  CompositeTokenPrimaryKey1752686842000,
  RenameAlertToggles1752674138685,
  AddAlertSoundParameter1753119779375,
  AddEmailAndJoinedAtToCreator1753117191000,
  UpdateCreatorProfileView1753117192000,
  AddDoneSetupCreatorField1753315853694,
  AddForceDonationOverlayRefresh1753315853694,
  AddCreatorAddresses1753656919000,
  AddReceiveEmailsCreatorField1753726864037,
  AddReferralEntity1753000000000,
} from './migrations';
import { CreatorProfileView } from './views';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Donation,
    DonationEffect,
    Token,
    User,
    Creator,
    CreatorNetwork,
    CreatorToken,
    DonationParameters,
    CreatorProfileView,
    CreatorAddress,
    Referral,
  ],
  synchronize: false,
  migrations: [
    InitialMigration1743173000000,
    RestructureDonations1743174000000,
    AddTokenDecimals1743177600000,
    AddAmountRaw1743181200000,
    AddDonationEffects1747686797772,
    AddCreatorProfileEntities1747843796640,
    AddDynamicId1748284091728,
    RefactorMuteToggles1748346009915,
    AddCreatorDisplayName1748521986209,
    AddBadWords1748967010401,
    RenameDynamicIdToPrivyId1749000000000,
    AddTokenName1752155170000,
    CompositeTokenPrimaryKey1752686842000,
    RenameAlertToggles1752674138685,
    AddAlertSoundParameter1753119779375,
    AddEmailAndJoinedAtToCreator1753117191000,
    UpdateCreatorProfileView1753117192000,
    AddDoneSetupCreatorField1753315853694,
    AddForceDonationOverlayRefresh1753315853694,
    AddCreatorAddresses1753656919000,
    AddReceiveEmailsCreatorField1753726864037,
    AddReferralEntity1753000000000,
  ],
});

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();

    const pendingMigrations = await AppDataSource.showMigrations();
    console.log('Pending migrations:', pendingMigrations);

    try {
      await AppDataSource.runMigrations();
      console.log('Migrations completed');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
  return AppDataSource;
}
