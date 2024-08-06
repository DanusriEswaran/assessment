<template>
  <!-- Template remains the same -->
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const url = import.meta.env.VITE_APP_URL;

const name = ref("");
const email = ref("");
const password = ref("");
const nameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const successMessage = ref("");
const router = useRouter();

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate() {
  nameError.value = emailError.value = passwordError.value = "";

  if (!name.value) {
    nameError.value = "Name is required";
  }

  if (!email.value) {
    emailError.value = "Email is required";
  } else if (!validateEmail(email.value)) {
    emailError.value = "Email is not valid";
  }

  if (!password.value) {
    passwordError.value = "Password is required";
  } else if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
  }

  return !nameError.value && !emailError.value && !passwordError.value;
}

async function handleSubmit() {
  if (validate()) {
    try {
      const response = await axios.post(`${url}/register`, {
        username: name.value,
        email: email.value,
        password: password.value,
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", name.value); // Store the username

      successMessage.value = "Account created successfully! Redirecting...";
      setTimeout(() => {
        router.push({ name: "home" });
      }, 1000);
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        emailError.value = error.response.data.message;
      } else {
        emailError.value = "An error occurred. Please try again.";
      }
    }
  }
}
</script>

<style scoped>
/* Styles remain the same */
</style>
