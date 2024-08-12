<template>
  <v-app>
    <v-container>
      <v-row>
        <!-- Display Username -->
        <v-col cols="12">
          <v-alert type="info" class="mb-4" color="rgb(156, 221, 235)">
            Welcome, {{ username }}
          </v-alert>
        </v-col>

        <!-- Task Table and Date Picker -->
        <v-col cols="12" md="8">
          <v-card class="tasktable">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn @click="openAddTaskForm" color="blue">Add Task</v-btn>
            </v-card-title>

            <v-data-table
              :headers="tableHeaders"
              :items="paginatedTasks"
              item-key="id"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:item.name="{ item }">
                {{ item.name }}
              </template>

              <template v-slot:item.status="{ item }">
                <v-icon
                  @click="toggleTaskStatus(item)"
                  :color="item.status === 'completed' ? 'green' : 'orange'"
                  class="pointer"
                >
                  <i
                    :class="
                      item.status === 'completed'
                        ? 'bi bi-check-circle'
                        : 'bi bi-hourglass-split'
                    "
                  ></i>
                </v-icon>
                <span>{{
                  item.status === "completed" ? " Completed" : "In Progress"
                }}</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon @click="editTask(item)" class="mr-2">mdi-pencil</v-icon>
                <v-icon @click="openDeleteConfirm(item.id)">mdi-delete</v-icon>
              </template>
            </v-data-table>

            <!-- Pagination Controls -->
            <nav aria-label="Page navigation example" class="mt-4">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(currentPage - 1)"
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(page)"
                    >{{ page }}</a
                  >
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(currentPage + 1)"
                    aria-label="Next"
                  >
                    <span aria-hidden="true">&raquo;</span>
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
const selectedDate = ref(new Date());
const showNoTasksDialog = ref(false);
const currentPage = ref(1);
const itemsPerPage = 3;

// Define headers for the tasks table
const tableHeaders = [
  { text: "Task Name", value: "name" },
  { text: "Status", value: "status" },
  { text: "Actions", value: "actions", align: "end" },
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
    const tasksResponse = await axios.get(`${apiUrl}/user/tasks`, config);
    tasks.value = tasksResponse.data;
  } catch (error) {
    console.error("Error fetching user or tasks:", error);
  }
}

async function fetchTasksByDate(date) {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");

    if (!apiUrl || !token) {
      console.error("API URL or Auth Token is missing");
      return;
    }

    // Ensure date is a Date object
    const formattedDate = formatDateToYMD(new Date(date));

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${apiUrl}/user/tasks/date/${formattedDate}`;
    const response = await axios.get(url, config);

    if (response.status === 200) {
      if (response.data.length === 0) {
        tasks.value = [];
        showNoTasksDialog.value = true;
      } else {
        tasks.value = response.data;
        showNoTasksDialog.value = false;
      }
    } else {
      console.error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
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
    date: task.date ? new Date(task.date) : new Date(), // Ensure date is a Date object
  };
  isEditing.value = true;
  showAddTaskForm.value = true;
}

async function toggleTaskStatus(task) {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Ensure URL and token are correct
    const url = `${apiUrl}/user/tasks/${task.id}/status`;

    // Log the URL and token for debugging
    console.log(`URL: ${url}, Token: ${token}`);

    // Toggle the status in the frontend
    task.status = task.status === "completed" ? "in-progress" : "completed";

    // Send the updated status to the server
    await axios.patch(url, { status: task.status }, config);
  } catch (error) {
    console.error("Error toggling task status:", error);
  }
}

function openDeleteConfirm(taskId) {
  deleteTaskId.value = taskId;
  showDeleteConfirm.value = true;
}

function closeDeleteConfirm() {
  deleteTaskId.value = null;
  showDeleteConfirm.value = false;
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

    await axios.delete(`${apiUrl}/user/tasks/${deleteTaskId.value}`, config);
    fetchUserAndTasks();
    closeDeleteConfirm();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

function handleDateChange(date) {
  selectedDate.value = date;
  fetchTasksByDate(date);
}

function formatDateToYMD(date) {
  // Ensure date is a Date object
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function handleNoTasksDialog() {
  showNoTasksDialog.value = false;
}

onMounted(() => {
  fetchUserAndTasks();
});

// Watch for changes in selectedDate to fetch tasks by date
watch(selectedDate, (newDate) => {
  fetchTasksByDate(newDate);
});
</script>

<style scoped>
.tasktable {
  overflow-x: auto;
}

.pointer {
  cursor: pointer;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.pagination .page-link {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}

.page-item.disabled .page-link::after {
  content: " ";
  pointer-events: none;
}
</style>
