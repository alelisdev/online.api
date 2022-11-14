import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './appModule';
import { runDbMigrations } from './shared/utils';



async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  
  // allow to access static asset files
  app.use('/uploads', express.static(join(__dirname as any, '..', 'uploads')));
  
  /**
   * Helmet can help protect your app from some well-known
   * web vulnerabilities by setting HTTP headers appropriately.
   * Generally, Helmet is just a collection of 12 smaller
   * middleware functions that set security-related HTTP headers
   *
   * https://github.com/helmetjs/helmet#how-it-works
   */
  // app.use(helmet());
  //  TODO - check what fits best cors:true or cors:'*'
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(options);
  
  console.log('---3--')

  // /**
  //  * we need this because "cookie" is true in csrfProtection
  //  */
  // app.use(cookieParser());

  // app.use(csurf({ cookie: true }));

  /**
   * To protect your applications from brute-force attacks
   */
  // app.use(
  //   new rateLimit({
  //     windowMs: 15 * 60 * 1000,
  //     max: 100,
  //   }),
  // );

  /**
   * Apply validation for all inputs globally
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Strip away all none-object existing properties
       */
      whitelist: true,
      /***
       * Transform input objects to their corresponding DTO objects
       */
      transform: true,
    }),
  );

  /**
   * Run DB migrations
   */
  await runDbMigrations();

  await app.listen(process.env.PORT);

  Logger.log(
    `Server started running on http://${process.env.HOST}:${process.env.PORT}`,
    'Bootstrap',
  );
}
bootstrap();
function __dirname(__dirname: any, arg1: string, arg2: string): any {
  throw new Error('Function not implemented.');
}

