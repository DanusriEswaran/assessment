import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/register", "AuthController.register");
  Route.post("/login", "AuthController.login");
}).prefix("/user");

// Task management routes
Route.group(() => {
  Route.get("/tasks", "TasksController.fetch"); // Get all tasks
  Route.post("/tasks", "TasksController.insert"); // Create a new task
  Route.get("/tasks/:id", "TasksController.show"); // Get a single task by ID
  Route.put("/tasks/:id", "TasksController.update"); // Update a task by ID
  Route.delete("/tasks/:id", "TasksController.destroy"); // Delete a task by ID

  // fetch the authenticated user's details
  Route.get("/userdetails", async ({ auth, response }) => {
    try {
      const user = await auth.authenticate();
      return response.json({ username: user.username });
    } catch (error) {
      return response.unauthorized(
        "You must be logged in to access this resource"
      );
    }
  });

  //fetch by date
  Route.get("/tasks/date/:date", "TasksController.filterByDate");
})
  .prefix("/user")
  .middleware("auth");

Route.group(() => {
  Route.post("/login", "AdminsController.login");
  Route.post("/register", "AdminsController.register");
}).prefix("/admin");

// Admin Task Management Routes
Route.group(() => {
  Route.post("/assigntask", "AdminFunctionsController.assignTask");
  Route.get("usertasks", "AdminFunctionsController.viewUsersWithTasks");
  Route.get("tasks/category", "AdminFunctionsController.categorizeTasks");
  Route.get("tasks/status", "AdminFunctionsController.trackTaskStatus");
})
  .prefix("/admin")
  .middleware(["auth"]);
