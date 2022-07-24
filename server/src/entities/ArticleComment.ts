import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./User";
import { Article } from "./Article";
import { ArticleCommentLike } from "./ArticleCommentLike";

@Index("FK_342374e1382a58243c9bcebc1351", ["userId"], {})
@Index("FK_5206717892f9b654d3db0417d3b2", ["objectId"], {})
@Index("FK_6472c40c562f7fab6024dc264bc3", ["parentId"], {})
@Index("FK_a55c2cebc263800c7ee408045b74", ["rootId"], {})
@Entity("article_comment")
export class ArticleComment {
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

  @Column("varchar", { name: "object_id", length: 36 })
  objectId: string;

  @Column("varchar", { name: "root_id", nullable: true, length: 36 })
  rootId: string | null;

  @Column("varchar", { name: "parent_id", nullable: true, length: 36 })
  parentId: string | null;

  @Column("varchar", { name: "user_id", length: 36 })
  userId: string;

  @ManyToOne(() => User, (user) => user.articleComments, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => Article, (article) => article.articleComments, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "object_id", referencedColumnName: "id" }])
  object: Article;

  @ManyToOne(
    () => ArticleComment,
    (articleComment) => articleComment.articleComments,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "parent_id", referencedColumnName: "id" }])
  parent: ArticleComment;

  @OneToMany(() => ArticleComment, (articleComment) => articleComment.parent)
  articleComments: ArticleComment[];

  @ManyToOne(
    () => ArticleComment,
    (articleComment) => articleComment.articleComments2,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "root_id", referencedColumnName: "id" }])
  root: ArticleComment;

  @OneToMany(() => ArticleComment, (articleComment) => articleComment.root)
  articleComments2: ArticleComment[];

  @OneToMany(
    () => ArticleCommentLike,
    (articleCommentLike) => articleCommentLike.object,
    {
      cascade: true
    }
  )
  likes: ArticleCommentLike[];
}
