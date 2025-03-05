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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // Give it a name (important)
    ) // Enable JWT authentication in Swagger UI (if needed)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🔹 Apply BearerAuth globally to all routes
  document.components.securitySchemes = {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  };

  document.security = [{ BearerAuth: [] }]; // Global security

  SwaggerModule.setup('api-docs', app, document);
  await app.listen(4000);
}
bootstrap();
