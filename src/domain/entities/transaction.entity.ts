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
import { User } from "./user.entity";
import { Category } from "./category.entity";
import { SubCategory } from "./sub-category.entity";
import { Origin } from "./origin.entity";

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

  @ManyToOne(() => Origin)
  @JoinColumn({ name: "origin_id" })
  origin: Origin;

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
    type: "boolean",
    default: false
  })
  isRecurring: boolean;

  @Column({
    type: "date",
    name: "end_date",
    nullable: true,
    default: null
  })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToMany(() => Category)
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

  @ManyToMany(() => SubCategory)
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
