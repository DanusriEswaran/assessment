import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({}, [
      rules.alpha({ allow: ["space"] }),
      rules.minLength(3),
      rules.maxLength(30),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
    ]),
    password: schema.string({}, [rules.minLength(6)]),
    rememberMeToken: schema.string.optional(),
  });

  public messages: CustomMessages = {
    "username.required": "Username is required",
    "username.alpha": "Username can only contain letters and spaces",
    "username.minLength": "Username must be at least 3 characters long",
    "username.maxLength": "Username cannot be more than 30 characters long",
    "email.required": "Email is required",
    "email.email": "A valid email address is required",
    "email.unique": "Email is already taken",
    "password.required": "Password is required",
    "password.minLength": "Password must be at least 6 characters long",
  };
}
