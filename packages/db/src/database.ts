/* eslint-disable turbo/no-undeclared-env-vars */
import { DataSource } from 'typeorm';

import {
  Creator,
  Donation,
  NftDonation,
  NftToken,
  NftCollection,
  TokenDonation,
  DonationEffect,
  DonationParameters,
  CreatorNetwork,
  CreatorToken,
  Token,
  User,
  Referral,
  CreatorAddress,
  DripDailyClaim,
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
  CreateDripDailyClaim1755298637000,
  PopulateCreatorTokenAndNetworkDefaults1754915299000,
  RenameEtherToEthereum1755609037000,
  AddIsDonorToCreator1757184858317,
  FixCreatorAddressSequence1757432868000,
  CleanupUnsupportedTokensNetworks1757496093000,
  RestructureDonations1758104996000,
  MoveNetworkToChildTables1758104997000,
  AddCollectibleEnabledToCreator1758546104000,
  RemoveWwwFromUrls1758590345135,
  AddTokenEnabledToCreator1758728078982,
  SplitNftMetadata1759318771000,
  FixIncorrectNftNames1759846236000,
  AddNewDonationTrigger1760958133000,
  UpdateUrlsToNewStructure1761231247000,
  AddTwitchInfoEntity1756826671316,
} from './migrations';
import { CreatorProfileView } from './views';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Donation,
    NftDonation,
    NftToken,
    NftCollection,
    TokenDonation,
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
    DripDailyClaim,
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
    CreateDripDailyClaim1755298637000,
    PopulateCreatorTokenAndNetworkDefaults1754915299000,
    RenameEtherToEthereum1755609037000,
    AddIsDonorToCreator1757184858317,
    FixCreatorAddressSequence1757432868000,
    CleanupUnsupportedTokensNetworks1757496093000,
    RestructureDonations1758104996000,
    MoveNetworkToChildTables1758104997000,
    AddCollectibleEnabledToCreator1758546104000,
    RemoveWwwFromUrls1758590345135,
    AddTokenEnabledToCreator1758728078982,
    SplitNftMetadata1759318771000,
    FixIncorrectNftNames1759846236000,
    AddNewDonationTrigger1760958133000,
    UpdateUrlsToNewStructure1761231247000,
    AddTwitchInfoEntity1756826671316,
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
