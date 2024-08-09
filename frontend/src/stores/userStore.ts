import { defineStore } from "pinia";
import axios, { AxiosError } from "axios";

// Define the User Store
export const useUserStore = defineStore("userStore", {
  state: () => ({
    username: "",
    tasks: [],
    showAddTaskForm: false,
    isEditing: false,
    selectedTask: null,
    showDeleteConfirm: false,
    deleteTaskId: null,
    selectedDate: new Date(), // Initialize with today's date
    showNoTasksDialog: false,
  }),
  actions: {
    // Fetch user details and tasks
    async fetchUserAndTasks() {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch user details
        const userResponse = await axios.get(
          `${import.meta.env.VITE_APP_URL}/user/userdetails`,
          config
        );
        this.username = userResponse.data.username;

        // Fetch tasks
        const tasksResponse = await axios.get(
          `${import.meta.env.VITE_APP_URL}/user/tasks`,
          config
        );
        this.tasks = tasksResponse.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching user details or tasks. Check API endpoint and network connection:",
            error.message
          );
        } else {
          console.error(
            "An unexpected error occurred while fetching user details or tasks:",
            error
          );
        }
      }
    },

    // Fetch tasks by date
    async fetchTasksByDate(date: Date) {
      try {
        const token = localStorage.getItem("authToken");
        if (!import.meta.env.VITE_APP_URL || !token) {
          console.error(
            "API URL or Auth Token is missing. Please check configuration."
          );
          return;
        }

        // Convert the date to YYYY-MM-DD format
        const formattedDate = date.toISOString().split("T")[0];
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const url = `${
          import.meta.env.VITE_APP_URL
        }/user/tasks/date/${formattedDate}`;
        const response = await axios.get(url, config);

        if (response.status === 200) {
          if (response.data.length === 0) {
            this.tasks = [];
            this.showNoTasksDialog = true;
          } else {
            this.tasks = response.data;
            this.showNoTasksDialog = false;
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 404) {
            this.tasks = [];
            this.showNoTasksDialog = true;
            console.error("No tasks found for the selected date.");
          } else {
            console.error(
              "Error fetching tasks for the selected date. Check API endpoint and network connection:",
              error.message
            );
          }
        } else {
          console.error(
            "An unexpected error occurred while fetching tasks by date:",
            error
          );
        }
      }
    },

    // Update task status
    async updateTaskStatus(task: { id: string; status: string }) {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(
          `${import.meta.env.VITE_APP_URL}/user/tasks/${task.id}`,
          { status: task.status },
          config
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error updating task status. Ensure task ID and status are correct:",
            error.message
          );
        } else {
          console.error(
            "An unexpected error occurred while updating task status:",
            error
          );
        }
      }
    },

    // Delete a task
    async deleteTask() {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(
          `${import.meta.env.VITE_APP_URL}/user/tasks/${this.deleteTaskId}`,
          config
        );
        await this.fetchUserAndTasks(); // Refresh the task list
        this.showDeleteConfirm = false; // Close the confirmation dialog
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error deleting task. Ensure task ID is valid and try again:",
            error.message
          );
        } else {
          console.error(
            "An unexpected error occurred while deleting the task:",
            error
          );
        }
      }
    },

    // Helper function to format date to YYYY-MM-DD
    formatDateToYMD(dateString: string) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
});
