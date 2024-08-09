import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AdminLoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email()]),
    password: schema.string({}, [rules.minLength(6)]),
  });

  public messages: CustomMessages = {
    "email.required": "Email is required",
    "email.email": "A valid email address is required",
    "password.required": "Password is required",
    "password.minLength": "Password must be at least 6 characters long",
  };
}
