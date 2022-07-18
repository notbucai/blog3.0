import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { Article } from "./Article";

@Index("FK_f1cf6e559a8ef2940a07cfe3c821", ["articleId"], {})
@Entity("article_menu", { schema: "blog" })
export class ArticleMenu {
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

  @Column("varchar", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("varchar", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @Column("varchar", { name: "target", nullable: true, length: 255 })
  target: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { name: "article_id", nullable: true, length: 36 })
  articleId: string | null;

  @ManyToOne(() => Article, (article) => article.menus, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
  article: Article;
}
