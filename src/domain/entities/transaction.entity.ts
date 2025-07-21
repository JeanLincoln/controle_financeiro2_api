import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Origin } from "./origin.entity";
import { User } from "./user.entity";
import { Category } from "./category.entity";
import { SubCategory } from "./sub-category.entity";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE"
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn({
    type: "int",
    unsigned: true
  })
  id: number;

  @Column({
    type: "varchar",
    length: 255
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255
  })
  description: string;

  @Column({
    type: "enum",
    enum: TransactionType
  })
  type: TransactionType;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2
  })
  amount: number;

  @Column({
    type: "date",
    name: "start_date"
  })
  startDate: Date;

  @Column({
    type: "date",
    name: "end_date",
    nullable: true,
    default: null
  })
  endDate?: Date | null;

  @Column({
    type: "int",
    unsigned: true,
    name: "user_id"
  })
  userId: number;

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

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Origin, (origin) => origin.transactions)
  @JoinColumn({ name: "origin_id" })
  origin: Origin;

  @ManyToMany(() => Category, (category) => category.transactions)
  @JoinTable({
    name: "transactions_categories",
    joinColumn: {
      name: "transaction_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id"
    }
  })
  categories: Category[];

  @ManyToMany(() => SubCategory, (subCategory) => subCategory.transactions)
  @JoinTable({
    name: "transactions_sub_categories",
    joinColumn: {
      name: "transaction_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "sub_category_id",
      referencedColumnName: "id"
    }
  })
  subCategories: SubCategory[];
}
