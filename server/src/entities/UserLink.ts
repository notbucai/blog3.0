import { Column, Entity, Index, JoinColumn, ManyToOne ,PrimaryGeneratedColumn }  from "typeorm";
import { User } from "./User";

@Index("FK_50afc0eb7abd87305440eb416a92", ["userId"], {})
@Entity("user_link")
export class UserLink {
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

  @Column("varchar", { name: "type", length: 255 })
  type: string;

  @Column("varchar", { name: "login_id",length: 255 })
  loginId: string;

  @Column("varchar", { name: "login_name", length: 255 })
  loginName: string;

  @Column("varchar", { name: "login_avatar", nullable: true, length: 255 })
  loginAvatar: string | null;

  @Column("varchar", { name: "login_email", nullable: true, length: 255 })
  loginEmail: string | null;

  @Column("varchar", { name: "login_openid", nullable: true, length: 255 })
  loginOpenid: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { name: "user_id", nullable: true, length: 36 })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.userLinks, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
