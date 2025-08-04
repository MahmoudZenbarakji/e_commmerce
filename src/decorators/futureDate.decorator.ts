// validators/is-future-date.decorator.ts

import {
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          return value instanceof Date && value.getTime() > new Date().getTime();
        },
        defaultMessage() {
          return 'Date must be in the future';
        },
      },
    });
  };
}
