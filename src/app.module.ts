import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './core/http/transform-response-interceptor';
import { Database } from './database/drivers/drivers.database';
import { DriverModule } from './driver/driver.module';
import { CpfIsValid } from './utils/cpfIsValid';
import { IsCpfIsValidConstraint } from './utils/isCpfIsValid.validator';

@Module({
  imports: [DriverModule],
  controllers: [],
  providers: [
    Database,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    IsCpfIsValidConstraint,
    CpfIsValid,
  ],
})
export class AppModule {}
