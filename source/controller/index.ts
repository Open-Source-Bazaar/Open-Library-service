import type {} from 'koa2-swagger-ui';
import { createAPI } from 'koagger';

import { isProduct } from '../utility';
import { BookController } from './Book';
import { UserController } from './User';

export * from './User';

export const { swagger, mocker, router } = createAPI({
    mock: !isProduct,
    controllers: [UserController, BookController]
});
