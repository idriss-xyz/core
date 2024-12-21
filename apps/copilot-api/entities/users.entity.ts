import {Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn({type: 'integer', name: 'uuid'})
    readonly uuid!: number;
}