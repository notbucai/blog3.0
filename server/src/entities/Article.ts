import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,PrimaryGeneratedColumn }  from "typeorm";
import { User } from "./User";
import { ArticleComment } from "./ArticleComment";
import { ArticleLike } from "./ArticleLike";
import { ArticleMenu } from "./ArticleMenu";
import { ArticleRead } from "./ArticleRead";
import { ArticleTag } from "./ArticleTag";

@Index("FK_fae0bad5f06a58f3d2b68e37f1111", ["userId"], {})
@Entity("article")
export class Article {
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

  @Column("timestamp", { name: "delete_at", nullable: true })
  deleteAt: Date | null;

  @Column("varchar", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("text", { name: "summary", nullable: true })
  summary: string | null;

  @Column("longtext", { name: "content", nullable: true })
  content: string | null;

  @Column("longtext", { name: "html_content", nullable: true })
  htmlContent: string | null;

  @Column("varchar", { name: "cover_url", nullable: true, length: 255 })
  coverUrl: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["Verifying", "VerifySuccess", "VerifyFail"],
  })
  status: "Verifying" | "VerifySuccess" | "VerifyFail" | null;

  @Column("enum", { name: "up", nullable: true, enum: ["Default", "Up"] })
  up: "Default" | "Up" | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { name: "user_id", nullable: true, length: 36 })
  userId: string | null;

  @Column("int", { name: "word_count" })
  wordCount: number |  null;


  @Column("int", { name: "browse_count", default: 0 })
  browseCount: number;

  @ManyToOne(() => User, (user) => user.articles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @OneToMany(() => ArticleComment, (articleComment) => articleComment.object)
  articleComments: ArticleComment[];

  @OneToMany(() => ArticleLike, (articleLike) => articleLike.object)
  likes: ArticleLike[];

  @OneToMany(() => ArticleMenu, (articleMenu) => articleMenu.article, {
    cascade: true
  })
  menus: ArticleMenu[];

  @OneToMany(() => ArticleRead, (articleRead) => articleRead.article)
  articleReads: ArticleRead[];

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.article, {
    cascade: true
  })
  tags: ArticleTag[];
}
