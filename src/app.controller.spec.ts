import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('AppController', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
    it('should return from root()', () => {
      appController.root();
    });
  });
});
