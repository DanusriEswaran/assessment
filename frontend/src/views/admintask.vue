<template>
  <div class="admin-dashboard">
    <v-container>
      <!-- Task Assignment -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <h2>Assign Task</h2>
            </v-card-title>
            <v-card-text>
              <!-- Select User-->
              <v-select
                v-model="userName"
                :items="userStask"
                item-text="fullName"
                item-value="id"
                label="Select User"
                outlined
              ></v-select>

              <!-- Task Name Input -->
              <v-text-field
                v-model="taskName"
                label="Task Name"
                outlined
              ></v-text-field>

              <!-- Task Description Input -->
              <v-text-field
                v-model="taskDescription"
                label="Task Description"
                outlined
              ></v-text-field>

              <!-- Task Category Selection -->
              <v-select
                v-model="taskCategory"
                :items="categories"
                label="Select Category"
                outlined
              ></v-select>

              <v-text-field
                v-model="taskDate"
                label="Task Date"
                type="date"
                outlined
              ></v-text-field>

              <!-- Assign Task Button -->
              <v-btn @click="assignTask" color="primary">Assign Task</v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Users and Assigned Tasks Section -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <h2>Users and Their Tasks</h2>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="userHeaders"
                :items="usersWithTasks"
                :items-per-page="itemsPerPage"
              >
                <template v-slot:item.tasks="{ item }">
                  <v-list>
                    <!-- Ensure item.tasks is defined and an array -->
                    <v-list-item-group v-if="item.tasks && item.tasks.length">
                      <v-list-item v-for="task in item.tasks" :key="task.id">
                        <v-list-item-content>
                          <v-list-item-title>{{ task.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                    <v-list-item v-else>
                      <v-list-item-content
                        >No tasks assigned</v-list-item-content
                      >
                    </v-list-item>
                  </v-list>
                </template>
                <!-- Pagination Controls -->
                <template v-slot:footer>
                  <v-pagination
                    v-model="pagination.page"
                    :length="pagination.totalPages"
                    @input="fetchUsers"
                  ></v-pagination>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Task Categorization Section -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h2>Tasks by Category</h2>
            </v-card-title>
            <v-card-text>
              <!-- Category Selection -->
              <v-select
                v-model="selectedCategory"
                :items="categories"
                label="Select Category"
                outlined
              ></v-select>
              <v-data-table
                :headers="taskHeaders"
                :items="categorizedTasks"
                :items-per-page="itemsPerPage"
              >
                <template v-slot:item.status="{ item }">
                  <v-chip :color="statusColors[item.status]">
                    {{ item.status }}
                  </v-chip>
                </template>
                <!-- Pagination Controls -->
                <template v-slot:footer>
                  <v-pagination
                    v-model="pagination.categoryPage"
                    :length="pagination.categoryTotalPages"
                    @input="fetchCategorizedTasks"
                  ></v-pagination>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Task Status Tracking Section -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h2>Track Task Status</h2>
            </v-card-title>
            <v-card-text>
              <!-- Status Selection -->
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="Select Status"
                outlined
              ></v-select>
              <v-data-table
                :headers="taskHeaders"
                :items="tasksByStatus"
                :items-per-page="itemsPerPage"
              >
                <template v-slot:item.status="{ item }">
                  <v-chip :color="statusColors[item.status]">
                    {{ item.status }}
                  </v-chip>
                </template>
                <!-- Pagination Controls -->
                <template v-slot:footer>
                  <v-pagination
                    v-model="pagination.statusPage"
                    :length="pagination.statusTotalPages"
                    @input="fetchTasksByStatus"
                  ></v-pagination>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Logout Button -->
      <v-row>
        <v-col cols="12">
          <v-btn @click="logout" color="error">Logout</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Confirmation Dialog -->
  <v-dialog v-model="showDialog" max-width="290">
    <v-card>
      <v-card-title class="headline">Task Assigned</v-card-title>
      <v-card-text> Task has been successfully assigned! </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";

// References for data handling
const users = ref([]);
const categories = ref(["meetings", "work", "teaching"]);
const selectedUser = ref(null);
const taskName = ref("");
const taskDescription = ref("");
const taskCategory = ref("");
const taskDate = ref("");
const selectedCategory = ref(null);
const selectedStatus = ref(null);
const usersWithTasks = ref(["meetings", "work", "teaching"]);
const categorizedTasks = ref([]);
const tasksByStatus = ref([]);
const userName = ref("");
const showDialog = ref(false);

const userStask = computed(() => {
  if (users.value.length !== 0) {
    return selectedUser.value;
  }
});
// Pagination data
const itemsPerPage = 3;
const pagination = ref({
  page: 1,
  totalPages: 1,
  categoryPage: 1,
  categoryTotalPages: 1,
  statusPage: 1,
  statusTotalPages: 1,
});

// Table headers
const userHeaders = ref([
  { text: "User ID", value: "id" },
  { text: "Username", value: "username" },
  { text: "Tasks", value: "tasks", sortable: false },
]);

const taskHeaders = ref([
  { text: "Task Name", value: "name" },
  { text: "Description", value: "description" },
  { text: "Category", value: "category" },
  { text: "Status", value: "status" },
  { date: "Date", value: "date" },
]);

const statusOptions = ref(["In Progress", "Completed"]);
const statusColors = ref({
  "In Progress": "orange",
  Completed: "green",
});

// Fetch authenticated user's tasks
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://127.0.0.1:3333/admin/usertasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log(response);
      users.value = await response.data.map((user) => ({
        id: user.userId,
        fullName: `${user.username} (ID: ${user.userid})`,
      }));
      userStask.value = users.value;
      usersWithTasks.value = response.data;
      const tempUsers = new Set(
        response.data.map((item) => [item.userId, item.username])
      );
      selectedUser.value = tempUsers;
      console.log("here:", usersWithTasks.value);
      console.log(selectedUser.value);
      // Update pagination info
      pagination.value.totalPages = Math.ceil(
        response.data.total / itemsPerPage
      );
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchUsers();
});

// Assign a task to a user
const assignTask = async () => {
  if (
    userName.value[0] &&
    taskName.value &&
    taskDescription.value &&
    taskCategory.value &&
    taskDate.value
  ) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://127.0.0.1:3333/admin/assigntask",
        {
          userid: userName.value[0], // Ensure this is correctly set
          name: taskName.value,
          description: taskDescription.value,
          category: taskCategory.value,
          date: taskDate.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("resp: ", response);
      if (response.status === 200) {
        showDialog.value = true;
        fetchUsers();
        resetTaskForm();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error details:", error.response.data.errors);
      } else {
        console.error("Error assigning task:", error);
      }
    }
  } else {
    console.error("Please fill all fields");
  }
};

// Fetch tasks by category
const fetchCategorizedTasks = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      "http://127.0.0.1:3333/admin/tasks/category",
      {
        params: {
          category: selectedCategory.value,
          page: pagination.value.categoryPage,
          perPage: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      categorizedTasks.value = response.data;
      // Update pagination info
      pagination.value.categoryTotalPages = Math.ceil(
        response.data.total / itemsPerPage
      );
    }
  } catch (error) {
    console.error("Error fetching categorized tasks:", error);
  }
};

// Fetch tasks by status
const fetchTasksByStatus = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      "http://127.0.0.1:3333/admin/tasks/status",
      {
        params: {
          status: selectedStatus.value,
          page: pagination.value.statusPage,
          perPage: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      tasksByStatus.value = response.data;
      // Update pagination info
      pagination.value.statusTotalPages = Math.ceil(
        response.data.total / itemsPerPage
      );
    }
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/";
};

// Reset task assignment form
const resetTaskForm = () => {
  userName.value = null;
  taskName.value = "";
  taskDescription.value = "";
  taskCategory.value = "";
};

// Watchers for fetching tasks based on selected filters
watch(selectedCategory, fetchCategorizedTasks);
watch(selectedStatus, fetchTasksByStatus);
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.v-card {
  margin-bottom: 20px;
}

.v-btn {
  margin-top: 10px;
}
</style>
