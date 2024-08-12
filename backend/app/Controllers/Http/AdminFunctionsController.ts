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
      task.userid = userid;
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

    const allowedCategories = ["meetings", "work", "teaching"];
    if (!allowedCategories.includes(category)) {
      return response.badRequest({ message: "Invalid category" });
    }

    try {
      // Fetch tasks and include the related user data
      const tasks = await Database.from("tasks")
        .innerJoin("users", "tasks.userid", "users.id")
        .select(
          "tasks.id as taskId",
          "tasks.name as taskName",
          "tasks.description as taskDescription",
          "tasks.category as taskCategory",
          "tasks.date as taskDate",
          "tasks.status as taskStatus",
          "users.username as userUsername"
        )
        .where("tasks.category", category);

      // Format tasks to include username
      const formattedTasks = tasks.map((task) => ({
        id: task.taskId,
        name: task.taskName,
        description: task.taskDescription,
        category: task.taskCategory,
        date: task.taskDate,
        status: task.taskStatus,
        username: task.userUsername,
      }));

      return response.ok(formattedTasks);
    } catch (error) {
      return response.badRequest({
        message: "Error fetching tasks by category",
        error: error.message,
      });
    }
  }

  public async trackTaskStatus({ request, response }: HttpContextContract) {
    const status = request.qs().status;

    const allowedStatuses = ["In Progress", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return response.badRequest({ message: "Invalid status" });
    }

    try {
      // Fetch tasks and include the related user data
      const tasks = await Database.from("tasks")
        .innerJoin("users", "tasks.userid", "users.id")
        .select(
          "tasks.id as taskId",
          "tasks.name as taskName",
          "tasks.description as taskDescription",
          "tasks.category as taskCategory",
          "tasks.date as taskDate",
          "tasks.status as taskStatus",
          "users.username as userUsername"
        )
        .where("tasks.status", status);

      // Format tasks to include username
      const formattedTasks = tasks.map((task) => ({
        id: task.taskId,
        name: task.taskName,
        description: task.taskDescription,
        category: task.taskCategory,
        date: task.taskDate,
        status: task.taskStatus,
        username: task.userUsername,
      }));

      return response.ok(formattedTasks);
    } catch (error) {
      return response.badRequest({
        message: "Error fetching tasks by status",
        error: error.message,
      });
    }
  }
}
