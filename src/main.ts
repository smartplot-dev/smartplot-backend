import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SmartPlot API')
    .setDescription('Documentación de la API de SmartPlot')
    .setVersion(process.env.APPVERSION ?? '0.1.0')
    .addTag('api')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory());
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
