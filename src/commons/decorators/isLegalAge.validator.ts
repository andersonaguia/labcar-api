import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LegalAge } from '../../utils/legalAge';

@Injectable()
@ValidatorConstraint()
export class IsLegalAgeConstraint implements ValidatorConstraintInterface {
  constructor(private legalAgeService: LegalAge) {}

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return this.legalAgeService.birthDate(value);
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'User must be over 18 years old';
  }
}

export function IsLegalAge(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsLegalAgeConstraint,
    });
  };
}
