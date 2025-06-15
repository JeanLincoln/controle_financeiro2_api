import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Origin } from "./origin.entity";
import { Category } from "./category.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({
    type: "int",
    unsigned: true
  })
  id: number;

  @Column({
    name: "first_name",
    type: "varchar",
    length: 255
  })
  firstName: string;

  @Column({
    name: "last_name",
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
    name: "birth_date",
    type: "date"
  })
  birthDate: Date;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    nullable: true,
    default: null
  })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Origin, (origin) => origin.user)
  origins: Origin[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
}
