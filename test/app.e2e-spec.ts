import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { join } from 'path';
import { readFileSync, readFile } from 'fs';
import { renderFile } from 'ejs';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication & INestExpressApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app
      .engine('html', renderFile)
      .setBaseViewsDir(join(__dirname, '../views'))
      .useStaticAssets(join(__dirname, '../views/public'), {
        index: false,
        redirect: false,
      });
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(
        readFileSync(join(__dirname, '../views/public/index.html')).toString(
          'utf8',
        ),
      );
  });
});
