import { schema, rules } from "@ioc:Adonis/Core/Validator";

export default class TaskValidator {
  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(255)]),
    description: schema.string.optional({}, [rules.maxLength(500)]),
    date: schema.string({}, [rules.regex(/^\d{4}-\d{2}-\d{2}$/)]),
    category: schema.string({}, [rules.maxLength(50)]),
    status: schema.string({}, [rules.maxLength(20)]),
  });

  public messages = {
    "name.required": "The task name is required",
    "name.maxLength": "The task name cannot be longer than 255 characters",
    "description.maxLength":
      "The description cannot be longer than 500 characters",
    "date.required": "The date is required",
    "date.regex": "The date must be in the format YYYY-MM-DD",
    "category.required": "The category is required",
    "category.maxLength": "The category cannot be longer than 50 characters",
    "status.required": "The status is required",
    "status.maxLength": "The status cannot be longer than 20 characters",
  };
}
