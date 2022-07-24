import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { LeaveWord } from "./LeaveWord";
import { User } from "./User";

@Index("FK_6d4744e365acc9a30eea3b7bc602", ["objectId"], {})
@Index("FK_e5fad51a417a7d1ca2e3bdc868a1", ["userId"], {})
@Entity("leave_word_like")
export class LeaveWordLike {
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

  @Column("varchar", { name: "ip", nullable: true, length: 255 })
  ip: string | null;

  @Column("text", { name: "client", nullable: true })
  client: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { name: "object_id", length: 36 })
  objectId: string;

  @Column("varchar", { name: "user_id", length: 36 })
  userId: string;

  @ManyToOne(() => LeaveWord, (leaveWord) => leaveWord.likes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "object_id", referencedColumnName: "id" }])
  object: LeaveWord;

  @ManyToOne(() => User, (user) => user.leaveWordLikes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
