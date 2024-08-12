<template>
  <v-container
    class="d-flex align-center justify-center"
    style="min-height: 100vh"
  >
    <v-row class="d-flex align-center justify-center fill-height">
      <v-col cols="15" md="9" lg="6">
        <h1 class="heading">Create Your Account</h1>
        <v-card class="card">
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="name"
              label="Name"
              :error-messages="nameError"
              class="text-field"
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              :error-messages="emailError"
              class="text-field"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              :error-messages="passwordError"
              class="text-field"
            ></v-text-field>
            <v-row justify="center" class="mt-4">
              <v-col cols="auto">
                <v-btn type="submit" class="signup">Sign Up</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-alert v-if="successMessage" type="success">{{
            successMessage
          }}</v-alert>
          <v-alert v-if="generalError" type="error">{{ generalError }}</v-alert>
        </v-card>
        <p class="info-text">Only users can register their accounts.</p>
      </v-col>
    </v-row>
  </v-container>
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
const generalError = ref("");
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
      const response = await axios.post(`${url}/user/register`, {
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
      generalError.value = "";

      if (error.response && error.response.data) {
        if (error.response.data.message === "Email already exists") {
          emailError.value = "Email is already in use. Please choose another.";
        } else {
          generalError.value =
            error.response.data.message ||
            "An error occurred. Please try again.";
        }
      } else {
        generalError.value = "An error occurred. Please try again.";
      }
    }
  }
}
</script>

<style scoped>
.heading {
  font-weight: bold;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
}

.v-btn.primary {
  background-color: #067796;
  color: white;
}

.v-btn.primary:hover {
  background-color: #09397d;
}

.text-field {
  margin-top: 22px;
  margin-left: 20px;
  margin-right: 20px;
  color: purple;
}

.signup {
  margin-bottom: 10px;
  background-color: #067796;
  color: white;
}

.card {
  background-color: #c7e2ea;
}

.info-text {
  text-align: center;
  margin-top: 10px;
  font-size: 0.875rem;
  color: #666;
}
</style>
