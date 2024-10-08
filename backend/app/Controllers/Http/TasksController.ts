import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Task from "App/Models/Task";
import TaskValidator from "App/Validators/TaskValidator";

export default class TasksController {
  // Fetch all tasks
  public async fetch({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      if (!user || !user.id) {
        return response
          .status(401)
          .json({ message: "User is not authenticated" });
      }
      const tasks = await Task.query()
        .where("userId", user.id)
        .select(["id", "name", "description", "date", "category", "status"]);
      return response.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return response
        .status(500)
        .json({ message: "Error fetching tasks", error: error.message });
    }
  }

  /**
   * Insert a new task for the authenticated user.
   */
  public async insert({ request, auth, response }: HttpContextContract) {
    const user = await auth.authenticate();
    if (!user || !user.id) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    // Validate request data
    const validatedData = await request.validate(TaskValidator);

    try {
      const task = await Task.create({ ...validatedData, userid: user.id });
      return response.status(201).json(task);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating task", error: error.message });
    }
  }

  /**
   * Show details of a specific task for the authenticated user.
   */
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
        .select(["id", "name", "description", "date", "category", "status"])
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

  /**
   * Update a specific task for the authenticated user.
   */
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

    // Validate and extract the task data
    const taskData = await request.validate(TaskValidator);

    try {
      const task = await Task.query()
        .where("userId", user.id)
        .where("id", params.id)
        .first();

      if (task) {
        // Update the task with new data
        task.merge(taskData);
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

  /**
   * Update the status of a specific task for the authenticated user.
   */
  public async updateStatus({
    params,
    request,
    auth,
    response,
  }: HttpContextContract) {
    // Authenticate user
    const user = await auth.authenticate();
    if (!user || !user.id) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    // Validate task ID
    if (!params.id) {
      return response.status(400).json({ message: "Task ID is required" });
    }

    // Extract status from request
    const { status } = request.only(["status"]);
    if (!status) {
      return response.status(400).json({ message: "Status is required" });
    }

    try {
      // Fetch the task associated with the user and ID
      const task = await Task.query()
        .where("userId", user.id)
        .where("id", params.id)
        .first();

      // Check if the task exists
      if (task) {
        // Update task status
        task.status = status;
        await task.save();
        return response.json(task);
      } else {
        return response.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      // Log the error and return a 500 status code
      console.error("Error updating task status:", error);
      return response
        .status(500)
        .json({ message: "Error updating task status", error: error.message });
    }
  }

  /**
   * Delete a specific task for the authenticated user.
   */
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

  /**
   * Filter tasks by date for the authenticated user.
   */
  public async filterByDate({ params, auth, response }: HttpContextContract) {
    const user = await auth.authenticate();
    if (!user || !user.id) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    const { date } = params; // Extract date from URL parameters
    if (!date) {
      return response
        .status(400)
        .json({ message: "Date parameter is required" });
    }

    // Validate date format manually
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      return response
        .status(400)
        .json({ message: "Date must be in the format YYYY-MM-DD" });
    }

    try {
      const tasks = await Task.query()
        .where("userid", user.id)
        .where("date", date)
        .select(["id", "name", "description", "date", "category", "status"]);

      if (tasks.length === 0) {
        return response
          .status(404)
          .json({ message: "No tasks found for the given date" });
      }

      return response.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks by date:", error);
      return response.status(500).json({
        message: "Error fetching tasks by date",
        error: error.message,
      });
    }
  }
}
