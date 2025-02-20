import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { Base } from './Base';
import { Book } from './Book';
import { User } from './User';

@Entity()
export class BookLog extends Base {
    @Type(() => User)
    @ValidateNested()
    @ManyToOne(() => User)
    creator: User;

    @Type(() => Book)
    @ValidateNested()
    @ManyToOne(() => Book)
    book: Book;
    /**
     * - donate: +n
     * - borrow: +1
     * - lend: -1
     * - lost: -n
     */
    @IsInt()
    @Column('int')
    count: number;
    /**
     * Borrow & Lend
     */
    @Type(() => BookLog)
    @IsOptional()
    @OneToOne(() => BookLog, { nullable: true })
    @JoinColumn()
    relatedLog?: BookLog;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    address?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    shipmentNumber?: string;
}
