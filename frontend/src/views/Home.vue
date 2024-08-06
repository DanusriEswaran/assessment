<template>
  <div class="home-container">
    <h1>Welcome, {{ username }}</h1>
    <div class="header">
      <h2>Your Tasks</h2>
      <v-btn @click="openAddTaskForm" color="primary" class="add-task-btn">
        Add Task
      </v-btn>
    </div>
    <table class="tasks-table">
      <thead>
        <tr>
          <th>Task Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.name }}</td>
          <td>
            <span class="status-icon">
              <i
                v-if="!task.status"
                class="fa-regular fa-bars-progress"
                title="In Progress"
              ></i>
              <span v-if="!task.status"> In Progress</span>
              <i
                v-if="task.status"
                class="fa fa-check"
                aria-hidden="true"
                title="Completed"
              ></i>
              <span v-if="task.status"> Completed</span>
              <v-btn @click="toggleStatus(task)" icon class="action-btn">
                <i
                  class="fa fa-sync-alt"
                  style="font-size: 16px; color: #21a6e4"
                ></i>
              </v-btn>
            </span>
          </td>
          <td>
            <v-btn @click="editTask(task)" icon class="action-btn">
              <i class="fa fa-edit" style="font-size: 30px; color: #21a6e4"></i>
            </v-btn>
            <v-btn @click="openDeleteConfirm(task.id)" icon class="action-btn">
              <i
                class="fa fa-trash"
                style="font-size: 30px; color: #21a6e4"
              ></i>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Task Modal -->
    <v-dialog v-model="showAddTaskForm" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{
            isEditing ? "Edit Task" : "Add Task"
          }}</span>
        </v-card-title>
        <v-card-text>
          <Form
            :task="selectedTask"
            @task-updated="fetchUserAndTasks"
            @form-closed="closeAddTaskForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this task?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteTask">Yes</v-btn>
          <v-btn color="secondary" @click="closeDeleteConfirm">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Form from "../components/form.vue";

const username = ref("");
const tasks = ref([]);
const showAddTaskForm = ref(false);
const isEditing = ref(false);
const selectedTask = ref(null);
const showDeleteConfirm = ref(false);
const deleteTaskId = ref(null);

async function fetchUserAndTasks() {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch user details
    const userResponse = await axios.get(`${apiUrl}/user`, config);
    username.value = userResponse.data.username;

    // Fetch tasks
    const tasksResponse = await axios.get(`${apiUrl}/tasks`, config);
    tasks.value = tasksResponse.data;
  } catch (error) {
    console.error("Error fetching user or tasks:", error);
  }
}

function openAddTaskForm() {
  isEditing.value = false;
  selectedTask.value = null;
  showAddTaskForm.value = true;
}

function closeAddTaskForm() {
  showAddTaskForm.value = false;
}

function editTask(task) {
  selectedTask.value = { ...task }; // Create a copy of the task to avoid direct mutation
  isEditing.value = true;
  showAddTaskForm.value = true;
}

async function toggleStatus(task) {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.patch(
      `${apiUrl}/tasks/${task.id}`,
      { status: !task.status },
      config
    );
    fetchUserAndTasks(); // Refresh the task list
  } catch (error) {
    console.error("Error toggling task status:", error);
  }
}

function openDeleteConfirm(taskId) {
  deleteTaskId.value = taskId;
  showDeleteConfirm.value = true;
}

async function deleteTask() {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${apiUrl}/tasks/${deleteTaskId.value}`, config);
    fetchUserAndTasks(); // Refresh the task list
    closeDeleteConfirm(); // Close the confirmation dialog
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

function closeDeleteConfirm() {
  showDeleteConfirm.value = false;
}

onMounted(fetchUserAndTasks);
</script>

<style scoped>
.home-container {
  max-width: 800px;
  padding: 20px;
  margin-right: 20px;
  margin-left: 20%;
}

h1 {
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
  font-size: 2.5rem;
  color: #045cb0;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th,
.tasks-table td {
  padding: 15px;
  border: 2px solid #528688;
  text-align: left;
}

.tasks-table th {
  background-color: #66a199;
}

.action-btn {
  background-color: transparent;
  box-shadow: none;
  margin-right: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-task-btn {
  margin-left: auto;
}

.status-icon {
  display: flex;
  align-items: center;
}

.status-icon i {
  margin-right: 5px;
}
</style>
