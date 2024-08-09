<template>
  <v-app>
    <div class="app-container">
      <div class="side-bar">
        <v-navigation-drawer v-if="!isAuthPage" app permanent>
          <v-list dense>
            <v-list-item to="/home" link>
              <v-list-item-icon>
                <i class="fas fa-home"></i>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
            <v-list-item to="/userdashboard" link>
              <v-list-item-icon>
                <i class="fas fa-tasks"></i>
              </v-list-item-icon>
              <v-list-item-title>My Tasks</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout" link>
              <v-list-item-icon>
                <i class="fas fa-sign-out-alt"></i>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </div>
      <div class="main-content">
        <v-main>
          <router-view />
        </v-main>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isAuthPage = computed(() => {
  const authPages = ["/", "/registration", "/admintask"];
  return authPages.includes(router.currentRoute.value.path);
});

function logout() {
  localStorage.removeItem("authToken"); // Clear authentication token
  router.push("/"); // Redirect to login or home
}
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.notification-badge {
  position: relative;
  top: -10px;
  right: -10px;
}
</style>
