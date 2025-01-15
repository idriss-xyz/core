import {Entity, PrimaryColumn} from 'typeorm';

@Entity('addresses')
export class AddressesEntity {
  @PrimaryColumn({type: 'text', name: 'address'})
  readonly address!: string;
}
