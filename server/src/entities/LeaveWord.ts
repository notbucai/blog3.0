import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./User";
import { LeaveWordLike } from "./LeaveWordLike";

@Index("FK_1d58a25d7313466b6cd4b18bcd12", ["parentId"], {})
@Index("FK_9be4a306c5f7401994d32d69edd1", ["rootId"], {})
@Index("FK_baac50024d026d8eee693b03ada11", ["userId"], {})
@Entity("leave_word")
export class LeaveWord {
  @Column("timestamp", {
    name: "create_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createAt: Date | null;

  @Column("timestamp", {
    name: "update_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updateAt: Date | null;

  @Column("text", { name: "content" })
  content: string;

  @Column("text", { name: "html_content" })
  htmlContent: string;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["Verifying", "VerifySuccess", "VerifyFail"],
    default: "'Verifying'",
    enumName: 'statusEnum',
  })
  status: "Verifying" | "VerifySuccess" | "VerifyFail" | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { name: "root_id", nullable: true, length: 36 })
  rootId: string | null;

  @Column("varchar", { name: "parent_id", nullable: true, length: 36 })
  parentId: string | null;

  @Column("varchar", { name: "user_id", length: 36 })
  userId: string;

  @ManyToOne(() => LeaveWord, (leaveWord) => leaveWord.leaveWords, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "parent_id", referencedColumnName: "id" }])
  parent: LeaveWord;

  @OneToMany(() => LeaveWord, (leaveWord) => leaveWord.parent)
  leaveWords: LeaveWord[];

  @ManyToOne(() => LeaveWord, (leaveWord) => leaveWord.leaveWords2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "root_id", referencedColumnName: "id" }])
  root: LeaveWord;

  @OneToMany(() => LeaveWord, (leaveWord) => leaveWord.root)
  leaveWords2: LeaveWord[];

  @ManyToOne(() => User, (user) => user.leaveWords, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @OneToMany(() => LeaveWordLike, (leaveWordLike) => leaveWordLike.object, {
    cascade: true
  })
  likes: LeaveWordLike[];
}
