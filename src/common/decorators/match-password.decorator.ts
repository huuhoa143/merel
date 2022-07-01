import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsMatchConfirmPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(confirmedPassword: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return confirmedPassword === relatedValue;
  }

  defaultMessage() {
    return 'PASSWORD.CONFIRM_PASSWORD_NOT_MATCH';
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function MatchConfirmPassword(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsMatchConfirmPasswordConstraint,
    });
  };
}
