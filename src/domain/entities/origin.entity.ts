import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { User } from "./user.entity";
import { Transaction } from "./transaction.entity";

@Entity("origins")
export class Origin {
  @PrimaryGeneratedColumn({
    type: "int",
    unsigned: true
  })
  id: number;

  @Column({
    type: "varchar",
    length: 100
  })
  name: string;

  @Column({
    type: "text",
    nullable: true
  })
  description: string;

  @Column({
    type: "varchar",
    length: 7,
    nullable: true
  })
  color: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true
  })
  icon: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: null
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.origin)
  transactions: Transaction[];
}
