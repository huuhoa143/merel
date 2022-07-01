import { ValidationError } from 'class-validator';
export interface NormalizeError {
  field: string;
  errorDetail: {
    [type: string]: string;
  };
}
/**
 * Beautiful Validation Errors
 * @param {ValidationError[]} errors
 * @returns {NormalizeError[]}
 */
export function normalizeValidationError(
  errors: ValidationError[],
): NormalizeError[] {
  return errors.map((err) => ({
    field: err.property,
    errorDetail: err.constraints,
  }));
}
