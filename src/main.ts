import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer, ValidationError } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
// import { config } from 'aws-sdk';
import * as winston from 'winston';

import { AppModule } from '@/app.module';
import { TransformInterceptor } from '@/common/interceptors/response';
import { normalizeValidationError } from '@/common/utility/exception.utility';
import { AllExceptionsFilter } from '@/common/exceptions/all-exceptions.filter';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

const errorStackTracerFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message,
    });
  }
  return info;
});

async function bootstrap() {
  // Step Logger
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.splat(), // Necessary to produce the 'meta' property
        errorStackTracerFormat(),
        winston.format.simple(),
      ),
      // options
      transports: [
        new winston.transports.File({
          filename: 'application-error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'application-debug.log',
          level: 'debug',
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        /*
        new WinstonCloudWatch({
          level: 'error',
          retentionInDays: 30,
          logGroupName: 'fizenpay-be',
          logStreamName: function () {
            // Spread log streams across dates as the server stays up
            const date = new Date().toISOString().split('T')[0];
            return 'fizenpay-be-' + date;
          },
          awsRegion: 'ap-southeast-1',
          jsonMessage: false,
        }),*/
      ],
    }),
  });
  // Setup Swagger
  const options = new DocumentBuilder()
    .setTitle('Auction Service')
    .setDescription('The auction Service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);
  // Global Validation Custom
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        if (errors.length > 0)
          throw new BadRequestException(normalizeValidationError(errors));
      },
    }),
  );
  // Response Transformer Mapping
  app.useGlobalInterceptors(new TransformInterceptor());
  // Config AWS
  // const configService = app.get(ConfigService);
  // config.update({ ...configService.get('aws') });
  // Start API Server

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({ credentials: true });

  // Use global filter
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(+process.env.PORT, function () {
    console.log(`start localhost:${process.env.PORT}`);
  });
}

bootstrap();
