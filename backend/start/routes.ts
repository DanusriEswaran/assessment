import Route from "@ioc:Adonis/Core/Route";

// Authentication routes
Route.group(() => {
  Route.post("/register", "AuthController.register");
  Route.post("/login", "AuthController.login");
}).prefix("/api");

// Task management routes
Route.group(() => {
  Route.get("/tasks", "TasksController.index"); // Get all tasks
  Route.post("/tasks", "TasksController.store"); // Create a new task
  Route.get("/tasks/:id", "TasksController.show"); // Get a single task by ID
  Route.put("/tasks/:id", "TasksController.update"); // Update a task by ID
  Route.delete("/tasks/:id", "TasksController.destroy"); // Delete a task by ID

  // Add the route to fetch the authenticated user's details
  Route.get("/user", async ({ auth, response }) => {
    try {
      const user = await auth.authenticate();
      return response.json({ username: user.username });
    } catch (error) {
      return response.unauthorized(
        "You must be logged in to access this resource"
      );
    }
  });
})
  .prefix("/api")
  .middleware("auth");
