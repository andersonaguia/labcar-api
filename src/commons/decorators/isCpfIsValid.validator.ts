import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CpfIsValid } from '../../utils/cpfIsValid';

@Injectable()
@ValidatorConstraint()
export class IsCpfIsValidConstraint implements ValidatorConstraintInterface {
  constructor(private cpfService: CpfIsValid) {}

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return this.cpfService.cpf(value);
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'CPF is not valid';
  }
}

export function IsCpfIsValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCpfIsValidConstraint,
    });
  };
}
