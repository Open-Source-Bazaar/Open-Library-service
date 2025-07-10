import type {} from 'koa2-swagger-ui';
import { createAPI } from 'koagger';

import { isProduct } from '../utility';
import { ActivityLogController } from './ActivityLog';
import { BaseController } from './Base';
import { BookController } from './Book';
import { FileController } from './File';
import { OauthController } from './OAuth';
import { UserController } from './User';

export * from './ActivityLog';
export * from './Base';
export * from './Book';
export * from './File';
export * from './OAuth';
export * from './User';

export const controllers = [
    BookController,
    OauthController,
    UserController,
    ActivityLogController,
    FileController,
    BaseController
];
export const { swagger, mocker, router } = createAPI({
    mock: !isProduct,
    controllers
});
