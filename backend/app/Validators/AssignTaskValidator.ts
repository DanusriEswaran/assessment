import { schema, rules } from "@ioc:Adonis/Core/Validator";

export default class AssignTaskValidator {
  public schema = schema.create({
    userid: schema.number([rules.required()]),
    name: schema.string([rules.required()]),
    description: schema.string.optional(),
    category: schema.string([rules.required()]),
    date: schema.date({ format: "yyyy-MM-dd" }),
  });

  public messages = {
    "userid.required": "User ID is required",
    "name.required": "Task name is required",
    "category.required": "Task category is required",
    "date.date": "Please provide a valid date in the format YYYY-MM-DD", // Custom error message
  };
}
