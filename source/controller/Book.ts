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
import { Like } from 'typeorm';

import {
    BaseFilter,
    Book,
    BookLog,
    BookMap,
    BooklistChunk,
    ResolvedBookMap,
    User,
    dataSource
} from '../model';

@JsonController('/book')
export class BookController {
    store = dataSource.getRepository(Book);
    logStore = dataSource.getRepository(BookLog);
    mapStore = dataSource.getRepository(BookMap);
    userStore = dataSource.getRepository(User);

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

    @Get('/:id/map')
    @ResponseSchema(ResolvedBookMap, { isArray: true })
    async getOneMap(@Param('id') bookId: number) {
        const list = await this.mapStore.find({ where: { bookId } });

        return Promise.all(
            list.map(async ({ bookId, userId, ...rest }) => ({
                ...rest,
                bookLogs: await this.logStore.find({
                    where: { book: { id: bookId }, creator: { id: userId } },
                    relations: ['relatedLog']
                }),
                user: await this.userStore.findOne({ where: { id: userId } })
            }))
        );
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
            where: keywords
                ? [
                      { title: Like(`%${keywords}%`) },
                      { description: Like(`%${keywords}%`) },
                      { authors: Like(`%${keywords}%`) },
                      { isbn: Like(`%${keywords}%`) },
                      { publisher: Like(`%${keywords}%`) }
                  ]
                : undefined,
            skip: (pageIndex - 1) * pageSize,
            take: pageSize
        });

        return { list, count };
    }
}
