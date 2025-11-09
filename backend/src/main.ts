import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://localhost:3005',
    'http://localhost:4000',
    'http://localhost:4001',
  ]);

  if (process.env.FRONTEND_URL) {
    allowedOrigins.add(process.env.FRONTEND_URL);
  }

  if (process.env.ADMIN_URL) {
    allowedOrigins.add(process.env.ADMIN_URL);
  }

  app.enableCors({
    origin: Array.from(allowedOrigins),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ✅ API prefix
  app.setGlobalPrefix('api');

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('AI Lyrics API')
    .setDescription('AI tarafından oluşturulan şarkıların API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🚀 Swagger'ı /swagger adresine taşıyoruz (önceden /api idi)
  SwaggerModule.setup('swagger', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📘 Swagger Docs: http://localhost:${PORT}/swagger`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);

  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📦 Using Mongo URI: ${process.env.MONGO_URI}`);


}
bootstrap();
