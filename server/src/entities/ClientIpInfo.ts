import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uni_ip', ['ip'], { unique: true })
@Entity('client_ip_info', { schema: 'blog' })
export class ClientIpInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'ip', unique: true, length: 255 })
  ip: string;

  @Column('varchar', { name: 'country', nullable: true, length: 100 })
  country: string | null;

  @Column('varchar', { name: 'countryCode', nullable: true, length: 255 })
  countryCode: string | null;

  @Column('varchar', { name: 'region', nullable: true, length: 255 })
  region: string | null;

  @Column('varchar', { name: 'regionName', nullable: true, length: 255 })
  regionName: string | null;

  @Column('varchar', { name: 'city', nullable: true, length: 100 })
  city: string | null;

  @Column('float', { name: 'lat', nullable: true, precision: 5, })
  lat: number | null;

  @Column('float', { name: 'lon', nullable: true, precision: 5,  })
  lon: number | null;

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
