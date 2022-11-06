import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { Acl } from "./Acl";
import { Role } from "./Role";

@Index("acl_map_id_mm1", ["aclId"], {})
@Index("role_map_id_mm2", ["roleId"], {})
@Entity("role_acl")
export class RoleAcl {
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

  @Column("varchar", { name: "role_id", length: 36 })
  roleId: string;

  @Column("varchar", { name: "acl_id", length: 36 })
  aclId: string;

  @ManyToOne(() => Acl, (acl) => acl.roleAcls, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "acl_id", referencedColumnName: "id" }])
  acl: Acl;

  @ManyToOne(() => Role, (role) => role.roleAcls, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;
}
