/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '@/modules/users/users.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private merchantsService: UsersService) {}

  validate(email: any, args: ValidationArguments) {
    return true;
    // return this.merchantsService
    //   .findByEmailAndProvider(email, authProviders.BASE)
    //   .then((email) => {
    //     return !!email;
    //   });
  }

  defaultMessage(args: ValidationArguments) {
    return 'EMAIL.EMAIL_NOT_EXISTS';
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsExistEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
