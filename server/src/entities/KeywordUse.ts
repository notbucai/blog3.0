import { Column, Entity ,PrimaryGeneratedColumn }  from "typeorm";

@Entity("keyword_use")
export class KeywordUse {
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

  @Column("varchar", { name: "content", length: 255 })
  content: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;
}
