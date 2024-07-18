import { Type } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';
import { ManyToOne, ViewColumn, ViewEntity } from 'typeorm';

import { Book } from './Book';
import { User } from './User';

@ViewEntity({
    expression: connection =>
        connection
            .createQueryBuilder()
            .from('BookLog', 'bl')
            .select('bl.book.id', 'bookId')
            .addSelect('bl.creator.id', 'userId')
            .addSelect('SUM(bl.count)', 'count')
            .groupBy('bl.book.id, bl.creator.id')
})
export class BookMap {
    @Type(() => Book)
    @ValidateNested()
    @ViewColumn()
    @ManyToOne(() => Book)
    book: Book;

    @Type(() => User)
    @ValidateNested()
    @ViewColumn()
    @ManyToOne(() => User)
    user: User;

    @ViewColumn()
    @IsInt()
    count: number;
}
