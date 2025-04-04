import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './guards/roles.guard';
import { AuthMiddleware } from './middleware/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new AuthMiddleware().use);
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  app.setGlobalPrefix(process.env.BACKEND_BASE_URL ?? 'api');

  const config = new DocumentBuilder()
    .setTitle('Book Management')
    .setDescription('API documentation')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    process.env.BACKEND_SWAGGER_URL ?? 'api',
    app,
    documentFactory,
  );

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
