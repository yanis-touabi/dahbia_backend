import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('NestJS API with Swagger')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT authentication in Swagger UI (if needed)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(4000);
}
bootstrap();
