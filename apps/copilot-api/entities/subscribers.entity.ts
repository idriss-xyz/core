import {Entity, PrimaryColumn} from "typeorm";

@Entity('subscribers')
export class SubscribersEntity {
    @PrimaryColumn({type: 'text', name: 'subscriber_id'})
    readonly subscriber_id!: string;
}