import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('File Storage API')
    .setDescription('API documentation for the File Storage Share Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Write the API spec to a file
  fs.writeFileSync('api-spec.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || 4000, () =>
    console.log(`Application is running on port ${process.env.PORT || 4000}`),
  );
}
bootstrap();
