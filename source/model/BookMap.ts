import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { ViewColumn, ViewEntity } from 'typeorm';

import { BookLog } from './BookLog';
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
    @IsInt()
    @Min(1)
    @ViewColumn()
    bookId: number;

    @IsInt()
    @Min(1)
    @ViewColumn()
    userId: number;

    @IsInt()
    @ViewColumn()
    count: number;
}

export class ResolvedBookMap {
    @Type(() => BookLog)
    @ValidateNested({ each: true })
    bookLogs: BookLog[];

    @Type(() => User)
    @ValidateNested()
    user: User;

    @IsInt()
    @ViewColumn()
    count: number;
}
