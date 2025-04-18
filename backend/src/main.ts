import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.BACKEND_BASE_URL ?? 'api');

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true                  
  });

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
