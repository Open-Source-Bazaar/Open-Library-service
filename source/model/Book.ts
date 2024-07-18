import { Type } from 'class-transformer';
import {
    IsCurrency,
    IsDateString,
    IsInt,
    IsISBN,
    IsString,
    IsUrl,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity } from 'typeorm';

import { Base, ListChunk } from './Base';

export class BooklistChunk implements ListChunk<Book> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Book)
    @ValidateNested({ each: true })
    list: Book[];
}

@Entity()
export class Book extends Base {
    @IsString()
    @Column({ unique: true })
    title: string;

    @IsString({ each: true })
    @Column('simple-json')
    authors: string[];

    @IsString()
    @Column('text')
    description: string;

    @IsUrl({}, { each: true })
    @Column('simple-json')
    images: string[];

    @IsCurrency()
    @Column('float')
    price: number;

    @IsISBN()
    @Column()
    isbn: string;

    @IsString()
    @Column()
    publisher: string;

    @IsDateString()
    @Column('datetime')
    publishedAt: Date;
}
