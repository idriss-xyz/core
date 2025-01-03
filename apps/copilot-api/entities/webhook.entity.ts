import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity('webhooks')
export class WebhookEntity {
    @PrimaryColumn({type: 'uuid', name: 'internal_id'})
    readonly internal_id!: string

    @Column({type: 'text', name: 'webhook_id'})
    readonly webhook_id!: string

    @Column({type: 'text', name: 'signing_key'})
    readonly signing_key!: string
}

