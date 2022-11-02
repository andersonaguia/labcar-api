import { IsLegalAgeConstraint } from './utils/isLegalAge.validator';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './core/http/transform-response-interceptor';
import { Database } from './database/drivers/drivers.database';
import { DriverModule } from './driver/driver.module';
import { CpfIsValid } from './utils/cpfIsValid';
import { IsCpfIsValidConstraint } from './utils/isCpfIsValid.validator';
import { LegalAge } from './utils/legalAge';

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
    IsLegalAgeConstraint,
    LegalAge,
  ],
})
export class AppModule {}
