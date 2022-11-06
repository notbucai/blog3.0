import { Column, Entity, OneToMany ,PrimaryGeneratedColumn }  from "typeorm";
import { RoleAcl } from "./RoleAcl";
import { UserRole } from "./UserRole";

@Entity("role")
export class Role {
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

  @Column("varchar", { name: "code", length: 255 })
  code: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => RoleAcl, (roleAcl) => roleAcl.role, { cascade: true })
  roleAcls: RoleAcl[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
