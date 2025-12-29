import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.intercepor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

void bootstrap();
