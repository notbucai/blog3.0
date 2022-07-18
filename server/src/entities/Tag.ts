import { Column, Entity, Index, OneToMany ,PrimaryGeneratedColumn }  from "typeorm";
import { ArticleTag } from "./ArticleTag";

@Index("IDX_6a9775008add570dc3e5a0bab7", ["name"], { unique: true })
@Entity("tag", { schema: "blog" })
export class Tag {
  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

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

  @Column("varchar", { name: "icon", nullable: true, length: 255 })
  icon: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.tag)
  tags: ArticleTag[];
}
