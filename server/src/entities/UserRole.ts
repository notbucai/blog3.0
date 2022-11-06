import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { User } from "./User";
import { Role } from "./Role";

@Index("useridd2", ["userId"], {})
@Index("userroleid3", ["roleId"], {})
@Entity("user_role")
export class UserRole {
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

  @Column("varchar", { name: "user_id", length: 36 })
  userId: string;

  @ManyToOne(() => User, (user) => user.userRoles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;
}
