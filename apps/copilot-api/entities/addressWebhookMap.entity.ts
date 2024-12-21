import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {AddressesEntity} from "./addreesses.entity";
import {WebhookEntity} from "./webhook.entity";
import {webhooks} from "../constants";

@Entity('address_webhook_map')
export class AddressWebhookMapEntity {
    @PrimaryColumn({type: 'text', name: 'address'})
    readonly address!: string

    @ManyToOne(() => AddressesEntity, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'address'})
    readonly addressEntity!: AddressesEntity;

    @Column({type: 'uuid', name: 'webhooks_internal_id'})
    @ManyToOne(() => WebhookEntity, (webhooks) => webhooks.internal_id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'webhooks_internal_id'})
    readonly webhook_internal_id!: string;
}