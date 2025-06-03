import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({
    type: "int",
    unsigned: true
  })
  id: number;

  @Column({
    type: "varchar",
    length: 255
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 255
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255
  })
  password: string;

  @Column({
    type: "date"
  })
  birthDate: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: null
  })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
