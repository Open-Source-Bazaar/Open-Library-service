import {
    Body,
    Get,
    JsonController,
    OnNull,
    Param,
    Patch,
    Post,
    QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { BaseFilter, dataSource } from '../model';
import { Book, BooklistChunk } from '../model/Book';

@JsonController('/book')
export class BookController {
    store = dataSource.getRepository(Book);

    @Post()
    @ResponseSchema(Book)
    createOne(@Body() book: Book) {
        return this.store.save(book);
    }

    @Get('/:id')
    @ResponseSchema(Book)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.store.findOne({ where: { id } });
    }

    @Patch('/:id')
    @ResponseSchema(Book)
    @OnNull(404)
    async updateOne(@Param('id') id: number, @Body() book: Book) {
        await this.store.update(id, book);

        return this.getOne(id);
    }

    @Get()
    @ResponseSchema(BooklistChunk)
    async getList(
        @QueryParams() { pageIndex, pageSize, keywords }: BaseFilter
    ) {
        const [list, count] = await this.store.findAndCount({
            where: {
                title: keywords,
                description: keywords,
                isbn: keywords,
                publisher: keywords
            },
            skip: (pageIndex - 1) * pageSize,
            take: pageSize
        });

        return { list, count };
    }
}
