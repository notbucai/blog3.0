import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { Article } from "./Article";
import { Tag } from "./Tag";

@Index("FK_26455b396109a0b535ddb6148324", ["articleId"], {})
@Index("FK_cdc3f155737b763c298ab080f842", ["tagId"], {})
@Entity("article_tag", { schema: "blog" })
export class ArticleTag {
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

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { name: "article_id", nullable: true, length: 36 })
  articleId: string | null;

  @Column("varchar", { name: "tag_id", nullable: true, length: 36 })
  tagId: string | null;

  @ManyToOne(() => Article, (article) => article.tags, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.tags, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "tag_id", referencedColumnName: "id" }])
  tag: Tag;
}
