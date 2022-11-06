import { Column, Entity ,PrimaryGeneratedColumn }  from "typeorm";

@Entity("keyword")
export class Keyword {
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

  @Column("int", { name: "count", nullable: true, default: "'0'" })
  count: number | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["BAD", "NORMAL", "GOOD"],
    default: "'NORMAL'",
    enumName: 'statusEnum',
  })
  status: "BAD" | "NORMAL" | "GOOD" | null;

  @Column("enum", {
    name: "origin",
    nullable: true,
    enum: ["article", "user", "system"],
  })
  origin: "article" | "user" | "system" | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;
}
