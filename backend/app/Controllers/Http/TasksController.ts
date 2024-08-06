import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Task from "App/Models/Task";
import Database from "@ioc:Adonis/Lucid/Database"; // Import the Database module

export default class TasksController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      if (!user || !user.id) {
        return response.status(401).json({ message: "User not authenticated" });
      }

      const tasks = await Database.from("tasks")
        .where("userId", user.id)
        .select("*");
      return response.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return response
        .status(500)
        .json({ message: "Error fetching tasks", error: error.message });
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const user = await auth.authenticate();
    if (!user || !user.id) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    const taskData = request.only(["name", "description", "date", "category"]);

    try {
      const task = await Task.create({ ...taskData, userid: user.id });
      return response.status(201).json(task);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating task", error: error.message });
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    const user = await auth.authenticate();
    if (!user || !user.id) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    if (!params.id) {
      return response.status(400).json({ message: "Task ID is required" });
    }

    try {
      const task = await Task.query()
        .where("userId", user.id)
        .where("id", params.id)
        .first();

      if (task) {
        return response.json(task);
      } else {
        return response.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      return response
        .status(500)
        .json({ message: "Error fetching task", error: error.message });
    }
  }

  public async update({
    params,
    request,
    auth,
    response,
  }: HttpContextContract) {
    const user = await auth.authenticate();
    if (!user || !user.id) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    if (!params.id) {
      return response.status(400).json({ message: "Task ID is required" });
    }

    try {
      const task = await Task.query()
        .where("userId", user.id)
        .where("id", params.id)
        .first();

      if (task) {
        task.merge(request.only(["name", "description", "date", "category"]));
        await task.save();
        return response.json(task);
      } else {
        return response.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      return response
        .status(500)
        .json({ message: "Error updating task", error: error.message });
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const user = await auth.authenticate();
    if (!user || !user.id) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    if (!params.id) {
      return response.status(400).json({ message: "Task ID is required" });
    }

    try {
      const task = await Task.query()
        .where("userId", user.id)
        .where("id", params.id)
        .first();

      if (task) {
        await task.delete();
        return response.status(204).json(null);
      } else {
        return response.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      return response
        .status(500)
        .json({ message: "Error deleting task", error: error.message });
    }
  }
}
