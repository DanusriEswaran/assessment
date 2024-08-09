<template>
  <v-container
    class="d-flex align-center justify-center"
    style="min-height: 100vh"
  >
    <v-row class="d-flex align-center justify-center fill-height">
      <v-col cols="15" md="9" lg="6">
        <h1 class="heading">Login your Account</h1>

        <v-card class="card">
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              class="text-field"
              :error-messages="emailError"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              :error-messages="passwordError"
              class="text-field"
            ></v-text-field>
            <v-select
              v-model="role"
              :items="['user', 'admin']"
              label="Select Role"
              class="text-field"
            ></v-select>

            <v-btn type="submit" class="signup">Login</v-btn>
          </v-form>
          <p class="signup-text">
            Don't have an account?
            <a href="#" @click.prevent="goToSignup">Sign up here</a>
          </p>
        </v-card>
        <v-alert v-if="successMessage" type="success">{{
          successMessage
        }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Access the backend URL
const url = import.meta.env.VITE_APP_URL;

const email = ref("");
const password = ref("");
const role = ref("user");
const router = useRouter();
const emailError = ref("");
const passwordError = ref("");
const successMessage = ref("");

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate() {
  emailError.value = passwordError.value = "";

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

  return !emailError.value && !passwordError.value;
}

async function handleLogin() {
  if (validate()) {
    console.log(url);
    try {
      // Determine the login URL based on the role
      const loginUrl =
        role.value === "admin" ? `${url}/admin/login` : `${url}/user/login`;

      console.log("Sending login request to:", loginUrl);
      const response = await axios.post(loginUrl, {
        email: email.value,
        password: password.value,
      });

      console.log("Login response:", response);

      const token = response.data.token;
      console.log(token);
      localStorage.setItem("authToken", token.token); // Store token under 'authToken'
      console.log(token.token);

      successMessage.value = "Account logged in successfully!";

      // Redirect based on role
      if (role.value === "admin") {
        router.push("/admintask");
      } else {
        router.push("/home");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          emailError.value = error.response.data.message;
        } else {
          emailError.value = "error in the email.";
        }
      } else {
        emailError.value = "An error occurred. Please try again.";
      }
    }
  }
}

function goToSignup() {
  router.push({ name: "registration" });
}
</script>

<style scoped>
.heading {
  font-weight: bold;
  font-size: 150%;
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.text-field {
  margin-top: 22px;
  margin-left: 20px;
  margin-right: 20px;
}

.signup {
  margin-top: 22px;
  margin-bottom: 20px;
  margin-left: 45%;
  background-color: #067796;
  color: white;
}

.signup:hover {
  background-color: #09397d;
}

.card {
  background-color: #c7e2ea;
  padding: 20px;
}

.signup-text {
  text-align: center;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 20px;
}

.signup-text a {
  color: #067796;
  text-decoration: none;
}

.signup-text a:hover {
  text-decoration: underline;
}
</style>
