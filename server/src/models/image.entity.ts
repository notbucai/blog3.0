import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity({name: 'images3'})
// export class Image2 {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column('string', { length: 10 })
//     name: string;
// }

@Entity({ name: 'images' })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('number', {})
    width: number;

    @Column('number', {})
    height: number;

    @Column('string', { length: 200 })
    url: string;

    @Column('string', { length: 50 })
    mime: string;

    @Column('number', {})
    size: number; // 单位字节

    @Column('string', { length: 50 })
    format: string;
}