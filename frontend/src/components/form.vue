<template>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <div v-if="task.id">
        <label>ID:</label>
        <input v-model="task.id" readonly />
      </div>

      <label>Task Name:</label>
      <input v-model="task.name" />

      <label>Description:</label>
      <input v-model="task.description" />

      <label>Task Date:</label>
      <input type="date" v-model="formattedDate" />

      <label>Category:</label>
      <select v-model="task.category">
        <option
          v-for="category in categories"
          :key="category.value"
          :value="category.value"
        >
          {{ category.text }}
        </option>
      </select>

      <label>Status:</label>
      <select v-model="task.status">
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <br />
      <br />
      <button type="submit">Save</button>
      <button @click="closeForm" class="cancel-button">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import axios from "axios";

const props = defineProps({
  task: Object,
});

const emit = defineEmits(["task-updated", "form-closed"]);

const categories = [
  { text: "Meetings", value: "Meetings" },
  { text: "Project", value: "Project" },
  { text: "Teaching", value: "Teaching" },
];

const task = ref({ ...props.task });
const formattedDate = ref(formatDate(task.value.date));

watch(
  () => props.task,
  (newTask) => {
    task.value = { ...newTask };
    formattedDate.value = formatDate(newTask.date);
  },
  { immediate: true }
);

function validateForm() {
  let isValid = true;

  if (!task.value.name) {
    isValid = false;
    console.error("Name is required.");
  }

  if (!task.value.description) {
    isValid = false;
    console.error("Description is required");
  }

  if (!task.value.date) {
    isValid = false;
    console.error("Task date is required.");
  }

  if (!task.value.category) {
    isValid = false;
    console.error("Category is required.");
  }

  if (!task.value.status) {
    isValid = false;
    console.error("Status is required.");
  }

  return isValid;
}

function formatDate(date) {
  const d = new Date(date);
  let mon = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (mon.length < 2) mon = "0" + mon;
  if (day.length < 2) day = "0" + day;

  return [year, mon, day].join("-");
}

async function submitForm() {
  if (validateForm()) {
    try {
      const apiUrl = import.meta.env.VITE_APP_URL;
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const taskData = {
        ...task.value,
        date: formatDate(task.value.date),
      };

      console.log("Task being sent: ", taskData);
      if (task.value.id) {
        await axios.put(
          `${apiUrl}/user/tasks/${task.value.id}`,
          taskData,
          config
        );
      } else {
        await axios.post(`${apiUrl}/user/tasks`, taskData, config);
      }

      emit("task-updated");
      emit("form-closed");
    } catch (error) {
      console.error(
        "Error saving task:",
        error.response ? error.response.data : error.message
      );
    }
  }
}

function closeForm() {
  emit("form-closed");
}
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-heading {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #19a4d2;
  color: white;
}

button[type="submit"]:hover {
  background-color: #0a6d98;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.error-message {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 5px;
  display: block;
}
</style>
