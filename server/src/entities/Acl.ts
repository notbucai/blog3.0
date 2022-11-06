import { Column, Entity, OneToMany ,PrimaryGeneratedColumn }  from "typeorm";
import { RoleAcl } from "./RoleAcl";

@Entity("acl")
export class Acl {
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

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("char", { name: "parent_id", nullable: true, length: 36 })
  parentId: string | null;

  @Column("varchar", { name: "code", length: 255 })
  code: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => RoleAcl, (roleAcl) => roleAcl.acl)
  roleAcls: RoleAcl[];
}
