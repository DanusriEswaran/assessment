<template>
  <v-app>
    <v-container>
      <v-row>
        <!-- Display Username -->
        <v-col cols="12">
          <v-alert type="info" class="mb-4">Welcome, {{ username }}</v-alert>
        </v-col>

        <!-- Task Table and Date Picker -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn @click="openAddTaskForm" color="primary">Add Task</v-btn>
            </v-card-title>

            <v-data-table
              :headers="tableHeaders"
              :items="paginatedTasks"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon @click="editTask(item)" class="mr-2">mdi-pencil</v-icon>
                <v-icon @click="openDeleteConfirm(item.id)">mdi-delete</v-icon>
              </template>
              <template v-slot:item.task="{ item }">
                <v-checkbox
                  v-model="item.completed"
                  @change="updateTaskStatus(item)"
                ></v-checkbox>
                {{ item.name }}
              </template>
            </v-data-table>

            <!-- Pagination Controls -->
            <nav aria-label="Page navigation example" class="mt-4">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" @click="changePage(currentPage - 1)"
                    >Previous</a
                  >
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page">
                  <a
                    class="page-link"
                    :class="{ active: page === currentPage }"
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </a>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a class="page-link" @click="changePage(currentPage + 1)"
                    >Next
                  </a>
                </li>
              </ul>
            </nav>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Date Picker</v-card-title>
            <v-date-picker
              v-model="selectedDate"
              @input="handleDateChange"
            ></v-date-picker>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- No Tasks Dialog -->
    <v-dialog v-model="showNoTasksDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">No Tasks Found</v-card-title>
        <v-card-text>No tasks are scheduled for the selected date.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="handleNoTasksDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import Form from "../components/form.vue";

const username = ref("");
const tasks = ref([]);
const showAddTaskForm = ref(false);
const isEditing = ref(false);
const selectedTask = ref(null);
const showDeleteConfirm = ref(false);
const deleteTaskId = ref(null);
const selectedDate = ref(new Date()); // Initialize with today's date
const showNoTasksDialog = ref(false);
const currentPage = ref(1);
const itemsPerPage = 3;

// Define headers for the tasks table
const tableHeaders = [
  { text: "Task", value: "task" },
  { text: "Actions", value: "actions" },
];

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return tasks.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(tasks.value.length / itemsPerPage);
});

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
    const userResponse = await axios.get(`${apiUrl}/user/userdetails`, config);
    username.value = userResponse.data.username;

    // Fetch tasks
    const tasksResponse = await axios.get(`${apiUrl}/tasks`, config);
    tasks.value = tasksResponse.data;
  } catch (error) {
    console.error("Error fetching user or tasks:", error);
  }
}

// Fetch tasks by date
async function fetchTasksByDate(date) {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");

    if (!apiUrl || !token) {
      console.error("API URL or Auth Token is missing");
      return;
    }

    // Convert the date to a common format YYYY-MM-DD
    const formattedDate = formatDateToYMD(date);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${apiUrl}/tasks/date/${formattedDate}`;
    console.log("Request URL: ", url);

    const response = await axios.get(url, config);
    console.log("API Response Data:", response.data);

    if (response.status === 200) {
      if (response.data.length === 0) {
        tasks.value = [];
        showNoTasksDialog.value = true;
      } else {
        tasks.value = response.data;
        console.log("Task Detail", tasks.value);
        showNoTasksDialog.value = false;
      }
    } else {
      console.error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("Tasks endpoint not found for the specified date.");
      tasks.value = [];
      showNoTasksDialog.value = true;
    } else {
      console.error("Error fetching tasks by date:", error);
    }
  }
}

function openAddTaskForm() {
  isEditing.value = false;
  selectedTask.value = {
    id: "",
    name: "",
    description: "",
    date: "",
    category: "",
  };
  showAddTaskForm.value = true;
}

function closeAddTaskForm() {
  showAddTaskForm.value = false;
}

function editTask(task) {
  selectedTask.value = {
    ...task,
    date: formatDateToYMD(task.date), // Format the date for the form input
  };
  isEditing.value = true;
  showAddTaskForm.value = true;
}

async function updateTaskStatus(task) {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // Send the updated status to the server if needed
    await axios.put(
      `${apiUrl}/tasks/${task.id}`,
      { completed: task.completed },
      config
    );
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}

function formatDateToYMD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function handleDateChange(date) {
  selectedDate.value = date;
  fetchTasksByDate(date);
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
    tasks.value = tasks.value.filter((task) => task.id !== deleteTaskId.value);
  } catch (error) {
    console.error("Error deleting task:", error);
  } finally {
    closeDeleteConfirm();
  }
}

function closeDeleteConfirm() {
  showDeleteConfirm.value = false;
}

function handleNoTasksDialog() {
  showNoTasksDialog.value = false;
}

function changePage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages.value) return;
  currentPage.value = pageNumber;
}

onMounted(() => {
  fetchUserAndTasks();
});

watch(selectedDate, (newDate) => {
  fetchTasksByDate(newDate);
});
</script>

<style scoped>
.welcome-alert {
  background-color: #e3f2fd; /* Light blue background */
  color: #0d47a1; /* Dark blue text */
}
</style>
