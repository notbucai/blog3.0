import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { Article } from "./Article";
import { User } from "./User";

@Index("FK_3cfecd365ab0ef48b7a34e40e7d3", ["objectId"], {})
@Index("FK_bbb15e03751797dcf09194affdb4", ["userId"], {})
@Entity("article_like", { schema: "blog" })
export class ArticleLike {
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

  @ManyToOne(() => Article, (article) => article.likes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "object_id", referencedColumnName: "id" }])
  object: Article;

  @ManyToOne(() => User, (user) => user.articleLikes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
