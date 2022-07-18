import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { User } from "./User";
import { ArticleComment } from "./ArticleComment";

@Index("FK_81760a4f6459171df120e51112c3", ["userId"], {})
@Index("FK_daaadf11d9b71b3f6b332da09cd4", ["objectId"], {})
@Entity("article_comment_like", { schema: "blog" })
export class ArticleCommentLike {
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

  @ManyToOne(() => User, (user) => user.articleCommentLikes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(
    () => ArticleComment,
    (articleComment) => articleComment.likes,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "object_id", referencedColumnName: "id" }])
  object: ArticleComment;
}
