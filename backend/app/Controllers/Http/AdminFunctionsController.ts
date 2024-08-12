import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Task from "App/Models/Task";
import User from "App/Models/User";
import AssignTaskValidator from "App/Validators/AssignTaskValidator";

export default class AdminFunctionsController {
  //assigning task
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
      // console.log("hi: assigned task inside");
      return response.ok({ message: "Task assigned successfully" });
    } catch (error) {
      return response.badRequest({ message: "Error assigning task", error });
    }
  }

  //users and their tasks
  public async viewUsersWithTasks({ response }: HttpContextContract) {
    try {
      const usersWithTasks = await User.query()
        .preload("tasks")
        .orderBy("id")
        .select("id", "username");
      const formattedUserWithTasks = usersWithTasks.map((user) => {
        return {
          userid: user.id,
          username: user.username,
          tasks: user.tasks.map((task) => ({
            taskId: task.id,
            taskName: task.name,
            taskDescription: task.description,
            taskCategory: task.category,
            taskStatus: task.status,
          })),
        };
      });
      return response.json(formattedUserWithTasks);
    } catch (error) {
      console.error("Error fetching users with tasks:", error);
      return response.status(500).json({
        message: "Error fetching users with tasks",
        error: error.message,
      });
    }
  }

  //task by category
  public async categorizeTasks({ request, response }: HttpContextContract) {
    const category = request.qs().category;
    const catList = ["meetings", "work", "teaching"];
    if (!catList.includes(category)) {
      return response.badRequest({ message: "Invalid category" });
    }
    try {
      const tasks = await Task.query()
        .where("category", category)
        .preload("user");
      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        category: task.category,
        date: task.date,
        status: task.status,
        username: task.user.username,
      }));
      return response.ok(formattedTasks);
    } catch (error) {
      return response.badRequest({
        message: "Error fetching tasks by category",
        error: error.message,
      });
    }
  }

  //task by status
  public async trackTaskStatus({ request, response }: HttpContextContract) {
    const status = request.qs().status;
    const statusList = ["In Progress", "Completed"];
    if (!statusList.includes(status)) {
      return response.badRequest({ message: "Invalid status" });
    }

    try {
      const tasks = await Task.query().where("status", status).preload("user");
      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        category: task.category,
        date: task.date,
        status: task.status,
        username: task.user.username,
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
