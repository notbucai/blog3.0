import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { Link } from "./Link";

@Entity("link_click", { schema: "blog" })
export class LinkClick {
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

  @Column("char", { name: "link_id", length: 36 })
  linkId: string;

}
