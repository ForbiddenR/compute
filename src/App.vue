<template>
  <div class="app">
    <header class="topbar">
      <div class="logo">Acme Portal</div>
      <nav class="nav">
        <button v-if="!isAuthenticated" class="nav-btn" :class="{ active: page === 'login' }" @click="page = 'login'">
          Login
        </button>
        <button class="nav-btn" :class="{ active: page === 'base64' }" :disabled="!isAuthenticated" @click="goBase64">
          Base64 Tool
        </button>
        <button v-if="isAuthenticated" class="nav-btn logout" @click="handleLogout">
          Logout
        </button>
      </nav>
    </header>

    <main class="content">
      <LoginPage v-if="page === 'login'" @login-success="handleLoginSuccess" />
      <Base64Page v-else />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginPage from './components/LoginPage.vue'
import Base64Page from './components/Base64Page.vue'
import { clearTokens, hasToken } from './api'

const isAuthenticated = ref(hasToken())
const page = ref(isAuthenticated.value ? 'base64' : 'login')

const handleLoginSuccess = () => {
  isAuthenticated.value = true
  page.value = 'base64'
}

const handleLogout = () => {
  clearTokens()
  isAuthenticated.value = false
  page.value = 'login'
}

const goBase64 = () => {
  page.value = isAuthenticated.value ? 'base64' : 'login'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
  color: #0f172a;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 0.04em;
}

.nav {
  display: flex;
  gap: 12px;
}

.nav-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: #e2e8f0;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn.active {
  background: #2563eb;
  color: #ffffff;
}

.nav-btn.logout {
  background: #fee2e2;
  color: #b91c1c;
}

.nav-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-btn:not(.active):hover {
  border-color: #94a3b8;
}

.content {
  flex: 1;
}
</style>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
