type StringValidator = (v: string) => string | boolean;

export class ValidationUtils {
  static nonEmptyString: StringValidator = (v: string) => (v && v.length >= 0) || "Field is required";
}