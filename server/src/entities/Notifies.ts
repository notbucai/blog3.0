import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Index("n_r_user_id", ["recipientId"], {})
@Index("n_user_id", ["senderId"], {})
@Entity("notifies", { schema: "blog" })
export class Notifies {
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

  @Column("timestamp", {
    name: "read_at",
    nullable: true,
  })
  readAt: Date | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("char", { name: "object_id", length: 36 })
  objectId: string;

  @Column("enum", {
    name: "object_type",
    enum: ["article", "article_comment", "leave_word"],
  })
  objectType: "article" | "article_comment" | "leave_word" | "user";

  @Column("char", { name: "sender_id", length: 36 })
  senderId: string;

  @Column("enum", { name: "sender_action", enum: ["comment", "like", "follow", "audit"] })
  senderAction: "comment" | "like" | 'follow' | 'audit';

  @Column("char", { name: "recipient_id", length: 36 })
  recipientId: string;

  @Column("varchar", { name: "content", length: 255 })
  content: string;

  @Column("varchar", { name: "message", nullable: true, length: 255 })
  message: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["Read", "New"],
    default: "'New'",
  })
  status: "Read" | "New" | null;

  @ManyToOne(() => User, (user) => user.recipientNotifies, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "recipient_id", referencedColumnName: "id" }])
  recipient: User;

  @ManyToOne(() => User, (user) => user.senderNotifies, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "sender_id", referencedColumnName: "id" }])
  sender: User;
}
