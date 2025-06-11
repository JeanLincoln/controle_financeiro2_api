import {
  Column,
  CreateDateColumn,
  Entity,
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

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Origin, (origin) => origin.id)
  origin: Origin;

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
    }
  })
  subCategories: SubCategory[];
}
