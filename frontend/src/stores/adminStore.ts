import { defineStore } from "pinia";
import axios from "axios";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    users: [] as Array<{ id: number; username: string }>,
    categories: ["meetings", "work", "teaching"],
    selectedUser: null as number | null,
    taskName: "",
    taskDescription: "",
    taskCategory: "",
    selectedCategory: null as string | null,
    selectedStatus: null as string | null,
    statusOptions: ["In Progress", "Completed"],
    statusColors: {
      "In Progress": "orange",
      Completed: "green",
    },
    usersWithTasks: [] as Array<any>,
    categorizedTasks: [] as Array<any>,
    tasksByStatus: [] as Array<any>,
  }),
  actions: {
    async fetchUsers() {
      try {
        const response = await axios.get("/admin/usertasks");
        console.log("hello");
        if (response.status === 200) {
          this.users = response.data.map((user: any) => ({
            id: user.id,
            username: user.username,
          }));
          this.usersWithTasks = response.data;
        } else {
          console.error(
            "Unexpected response status when fetching users:",
            response.status
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Failed to fetch users. Please check your network connection and try again.",
            error.message
          );
        } else {
          console.error(
            "An unexpected error occurred while fetching users:",
            error
          );
        }
      }
    },

    async assignTask() {
      if (
        this.selectedUser &&
        this.taskName &&
        this.taskDescription &&
        this.taskCategory
      ) {
        try {
          const response = await axios.post("/admin/assigntask", {
            userId: this.selectedUser,
            name: this.taskName,
            description: this.taskDescription,
            category: this.taskCategory,
          });
          if (response.status === 200) {
            console.log("Task assigned successfully.");
            this.resetTaskForm();
            this.fetchUsers(); // Refresh the users with tasks list
          } else {
            console.error(
              "Unexpected response status when assigning task:",
              response.status
            );
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Failed to assign task. Please check your input and try again.",
              error.message
            );
          } else {
            console.error(
              "An unexpected error occurred while assigning task:",
              error
            );
          }
        }
      } else {
        console.error(
          "All fields (user, task name, description, and category) are required to assign a task."
        );
      }
    },

    async viewTasks(userId: number) {
      try {
        const response = await axios.get(`/admin/viewTasks/${userId}`);
        if (response.status === 200) {
          this.usersWithTasks = response.data;
        } else {
          console.error(
            "Unexpected response status when fetching tasks for user:",
            response.status
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Failed to fetch tasks for the selected user. Please check your network connection and try again.",
            error.message
          );
        } else {
          console.error(
            "An unexpected error occurred while fetching tasks for user:",
            error
          );
        }
      }
    },

    async fetchCategorizedTasks() {
      if (this.selectedCategory) {
        try {
          const response = await axios.get("/admin/categorizeTasks", {
            params: { category: this.selectedCategory },
          });
          if (response.status === 200) {
            this.categorizedTasks = Array.isArray(response.data)
              ? response.data
              : [];
          } else {
            console.error(
              "Unexpected response status when fetching categorized tasks:",
              response.status
            );
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Failed to fetch tasks for the selected category. Please check your network connection and try again.",
              error.message
            );
          } else {
            console.error(
              "An unexpected error occurred while fetching categorized tasks:",
              error
            );
          }
        }
      } else {
        console.error(
          "No category selected. Please select a category to fetch tasks."
        );
      }
    },

    async fetchTasksByStatus() {
      if (this.selectedStatus) {
        try {
          const response = await axios.get("/admin/trackTaskStatus", {
            params: { status: this.selectedStatus },
          });
          if (response.status === 200) {
            this.tasksByStatus = Array.isArray(response.data)
              ? response.data
              : [];
          } else {
            console.error(
              "Unexpected response status when fetching tasks by status:",
              response.status
            );
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Failed to fetch tasks by status. Please check your network connection and try again.",
              error.message
            );
          } else {
            console.error(
              "An unexpected error occurred while fetching tasks by status:",
              error
            );
          }
        }
      } else {
        console.error(
          "No status selected. Please select a status to fetch tasks."
        );
      }
    },

    resetTaskForm() {
      this.selectedUser = null;
      this.taskName = "";
      this.taskDescription = "";
      this.taskCategory = "";
    },
  },
});
