// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { EskizService } from '../modules/eskiz/eskiz.service';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const eskizService = app.get(EskizService);

//   try {
//     await eskizService.authenticate();
//     console.log('Authorization completed successfully');
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await app.close();
//   }
// }

// bootstrap();
