import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany
} from "typeorm";
import { SubCategory } from "./sub-category.entity";
import { Transaction } from "./transaction.entity";

export enum CategoryType {
  INCOME,
  EXPENSE
}

@Entity("categories")
export class Category {
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
    type: "enum",
    enum: CategoryType
  })
  type: CategoryType;

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

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];

  @ManyToMany(() => Transaction, (transaction) => transaction.categories)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
