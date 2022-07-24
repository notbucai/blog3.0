import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { User } from "./User";
import { Article } from "./Article";

@Index("FK_c9a73cb3828ec1407dc5e680bcc3", ["userId"], {})
@Index("FK_fc2a17cc39708b9f382a52db9122", ["articleId"], {})
@Entity("article_read")
export class ArticleRead {
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

  @Column("varchar", { name: "article_id", length: 36 })
  articleId: string;

  @Column("varchar", { name: "user_id", length: 36, nullable: true })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.articleReads, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => Article, (article) => article.articleReads, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
  article: Article;
}
