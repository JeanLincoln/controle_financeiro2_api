import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn
} from "typeorm";
import { Category } from "./category.entity";
import { Transaction } from "./transaction.entity";

@Entity("sub_categories")
export class SubCategory {
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

  @Column({
    type: "int",
    unsigned: true,
    name: "category_id"
  })
  categoryId: number;

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

  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToMany(() => Transaction, (transaction) => transaction.subCategories)
  transactions: Transaction[];
}
