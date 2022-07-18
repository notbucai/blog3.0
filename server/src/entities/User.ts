import { Column, Entity, OneToMany ,PrimaryGeneratedColumn }  from "typeorm";
import { Article } from "./Article";
import { ArticleComment } from "./ArticleComment";
import { ArticleCommentLike } from "./ArticleCommentLike";
import { ArticleLike } from "./ArticleLike";
import { ArticleRead } from "./ArticleRead";
import { LeaveWord } from "./LeaveWord";
import { LeaveWordLike } from "./LeaveWordLike";
import { Notifies } from "./Notifies";
import { UserLink } from "./UserLink";
import { UserRole } from "./UserRole";

@Entity("user", { schema: "blog" })
export class User {
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

  @Column("timestamp", { name: "login_at", nullable: true })
  loginAt: Date | null;

  @Column("timestamp", { name: "activate_at", nullable: true })
  activateAt: Date | null;

  @Column("varchar", { name: "username", length: 128 })
  username: string;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("char", { name: "phone", length: 36 })
  phone: string;

  @Column("varchar", { name: "pass", nullable: true, length: 255 })
  pass: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["InActive", "Actived", "Frozen"],
  })
  status: "InActive" | "Actived" | "Frozen" | null;

  @Column("varchar", { name: "avatar_url", nullable: true, length: 255 })
  avatarUrl: string | null;

  @Column("enum", {
    name: "sex",
    nullable: true,
    enum: ["Male", "Female", "Unknown"],
    default: "'Unknown'",
    enumName: 'sexEnum',
  })
  sex: "Male" | "Female" | "Unknown" | null;

  @Column("varchar", { name: "job", nullable: true, length: 255 })
  job: string | null;

  @Column("varchar", { name: "company", nullable: true, length: 255 })
  company: string | null;

  @Column("varchar", { name: "introduce", nullable: true, length: 255 })
  introduce: string | null;

  @Column("varchar", { name: "website", nullable: true, length: 255 })
  website: string | null;

  @Column("varchar", { name: "location", nullable: true, length: 255 })
  location: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("int", { name: "is_admin", default: 0 })
  isAdmin: number;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => ArticleComment, (articleComment) => articleComment.user)
  articleComments: ArticleComment[];

  @OneToMany(
    () => ArticleCommentLike,
    (articleCommentLike) => articleCommentLike.user
  )
  articleCommentLikes: ArticleCommentLike[];

  @OneToMany(() => ArticleLike, (articleLike) => articleLike.user)
  articleLikes: ArticleLike[];

  @OneToMany(() => ArticleRead, (articleRead) => articleRead.user)
  articleReads: ArticleRead[];

  @OneToMany(() => LeaveWord, (leaveWord) => leaveWord.user)
  leaveWords: LeaveWord[];

  @OneToMany(() => LeaveWordLike, (leaveWordLike) => leaveWordLike.user)
  leaveWordLikes: LeaveWordLike[];

  @OneToMany(() => UserLink, (userLink) => userLink.user)
  userLinks: UserLink[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => Notifies, (notifies) => notifies.recipient)
  recipientNotifies: Notifies[];

  @OneToMany(() => Notifies, (notifies) => notifies.sender)
  senderNotifies: Notifies[];
}
