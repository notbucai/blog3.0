import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client_record')
export class ClientRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'ip', nullable: true, length: 255 })
  ip: string | null;

  @Column('text', { name: 'client', nullable: true })
  client: string | null;

  @Column('varchar', { name: 'user_id', length: 36, nullable: true })
  userId: string | null;

  @Column('timestamp', {
    name: 'create_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date | null;

  @Column('timestamp', {
    name: 'update_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date | null;
}
