// app/Controllers/Http/AdminFunctionsController.ts
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Task from "App/Models/Task";
import Database from "@ioc:Adonis/Lucid/Database";
import AssignTaskValidator from "App/Validators/AssignTaskValidator";

export default class AdminFunctionsController {
  public async assignTask({ request, response }: HttpContextContract) {
    const validation = await request.validate(AssignTaskValidator);

    const { userid, name, description, category, date } = validation;

    try {
      const task = new Task();
      task.userid = userid; // Using `userid` for the user reference
      task.name = name;
      task.description = description || "";
      task.category = category;
      task.date = date.toFormat("yyyy-MM-dd");
      await task.save();
      console.log("hi: assigned task inside");
      return response.ok({ message: "Task assigned successfully" });
    } catch (error) {
      return response.badRequest({ message: "Error assigning task", error });
    }
  }

  public async viewUsersWithTasks({ response }: HttpContextContract) {
    try {
      // Fetch users with their tasks
      const usersWithTasks = await Database.from("users")
        .leftJoin("tasks", "users.id", "tasks.userid")
        .select(
          "users.id as userId",
          "users.username",
          "tasks.id as taskId",
          "tasks.name as taskName",
          "tasks.description as taskDescription",
          "tasks.category as taskCategory",
          "tasks.status as taskStatus"
        )
        .orderBy("users.id");
      response.json(usersWithTasks); // Ensure JSON response
    } catch (error) {
      console.error("Error fetching users with tasks:", error);
      return response.status(500).json({
        message: "Error fetching users with tasks",
        error: error.message,
      });
    }
  }

  public async categorizeTasks({ request, response }: HttpContextContract) {
    const category = request.qs().category;

    // Validate category
    const allowedCategories = ["meetings", "work", "teaching"];
    if (!allowedCategories.includes(category)) {
      return response.badRequest({ message: "Invalid category" });
    }

    try {
      const tasks = await Task.query().where("category", category);
      return response.ok(tasks);
    } catch (error) {
      return response.badRequest({
        message: "Error fetching tasks by category",
        error,
      });
    }
  }

  public async trackTaskStatus({ request, response }: HttpContextContract) {
    const status = request.qs().status;

    // Validate status
    const allowedStatuses = ["In Progress", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return response.badRequest({ message: "Invalid status" });
    }

    try {
      const tasks = await Task.query().where("status", status);
      return response.ok(tasks);
    } catch (error) {
      return response.badRequest({
        message: "Error fetching tasks by status",
        error,
      });
    }
  }
}
