import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {UsersEntity} from "./users.entity";

@Entity('addresses')
export class AddressesEntity {
    @PrimaryColumn({type: "text", name: 'address'})
    readonly address!: string

    @Column({type: 'uuid', name: 'user_uuid', nullable: false})
    @ManyToOne(() => UsersEntity, (user) => user.uuid, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_uuid', referencedColumnName: 'uuid'})
    readonly userId!: number;
}