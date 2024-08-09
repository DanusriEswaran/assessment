<template>
  <div class="home-page">
    <div class="content">
      <img src="@/assets/task.png" alt="Task Image" class="task-image" />
      <div class="welcome-message">
        <h1
          style="
            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman',
              serif;
            font-style: normal;
          "
        >
          Welcome, {{ username }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const username = ref("");

async function fetchUser() {
  try {
    const apiUrl = import.meta.env.VITE_APP_URL;
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${apiUrl}/user/userdetails`, config);
    username.value = response.data.username;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5; /* Light gray background */
}

.content {
  text-align: center;
}

.task-image {
  width: 800px; /* Adjust as needed */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 20px; /* Space between image and text */
}

h1 {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-style: italic;
  color: #333; /* Darker text color */
}
</style>
