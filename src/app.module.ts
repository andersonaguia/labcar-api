import { IsLegalAgeConstraint } from './commons/decorators/isLegalAge.validator';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './core/http/transform-response-interceptor';
//import { Database } from './database/drivers/drivers.database';
import { DriverModule } from './driver/driver.module';
import { CpfIsValid } from './utils/cpfIsValid';
import { IsCpfIsValidConstraint } from './commons/decorators/isCpfIsValid.validator';
import { LegalAge } from './utils/legalAge';
import { PassengerModule } from './passenger/passenger.module';
import { TravelModule } from './travel/travel.module';

@Module({
  imports: [DriverModule, PassengerModule, TravelModule],
  controllers: [],
  providers: [
    //Database,
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
