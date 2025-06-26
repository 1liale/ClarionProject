import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow requests from any origin during development/testing.
  // Adjust for production security needs.
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
