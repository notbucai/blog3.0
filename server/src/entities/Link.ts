import { Column, Entity, OneToMany ,PrimaryGeneratedColumn }  from "typeorm";
import { LinkClick } from "./LinkClick";

@Entity("link", { schema: "blog" })
export class Link {
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

  @Column("varchar", { name: "url", length: 255 })
  url: string;

  @Column("varchar", { name: "logo", nullable: true, length: 255 })
  logo: string | null;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("varchar", { name: "intro", nullable: true, length: 255 })
  intro: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

}
