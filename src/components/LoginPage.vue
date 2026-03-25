<template>
    <div class="page">
        <div class="card">
            <div class="brand">Acme Portal</div>
            <h1>Welcome back</h1>
            <p>Sign in to continue.</p>

            <form @submit.prevent="handleSubmit">
                <div class="field">
                    <label for="email">Email</label>
                    <input id="email" v-model.trim="form.email" type="email" placeholder="you@company.com"
                        autocomplete="email" required />
                </div>

                <div class="field">
                    <label for="password">Password</label>
                    <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        placeholder="••••••••" autocomplete="current-password" required />
                </div>

                <div class="row">
                    <label class="remember">
                        <input type="checkbox" v-model="form.remember" />
                        Remember me
                    </label>
                    <a href="#">Forgot password?</a>
                </div>

                <button class="btn" type="submit" :disabled="isSubmitting || !isValid">
                    {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
                </button>

                <div v-if="message" class="message" :class="message.type">
                    {{ message.text }}
                </div>
            </form>

            <div class="helper">New here? <a href="#">Create an account</a></div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { authFetch } from '../api'

const emit = defineEmits(['login-success'])

const form = reactive({
    email: '',
    password: '',
    remember: false,
})

const isSubmitting = ref(false)
const showPassword = ref(false)
const message = ref(null)

const isValid = computed(() => form.email.length > 4 && form.password.length >= 6)

const handleSubmit = async () => {
    message.value = null

    if (!isValid.value) {
        message.value = { type: 'error', text: 'Please enter a valid email and password.' }
        return
    }

    isSubmitting.value = true

    try {
        const response = await authFetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: form.email,
                password: form.password,
            }),
        })

        const data = await response.json().catch(() => null)

        if (!response.ok) {
            message.value = {
                type: 'error',
                text: data?.error?.message || 'Login failed. Please try again.',
            }
            return
        }

        const storage = form.remember ? localStorage : sessionStorage
        if (data?.accessToken) storage.setItem('accessToken', data.accessToken)
        if (data?.refreshToken) storage.setItem('refreshToken', data.refreshToken)
        if (data?.user) storage.setItem('user', JSON.stringify(data.user))

        const userEmail = data?.user?.email || form.email
        message.value = { type: 'success', text: `Signed in as ${userEmail}.` }
        emit('login-success', data?.user || null)
    } catch (error) {
        message.value = { type: 'error', text: 'Network error. Please try again.' }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
:root {
    color-scheme: light;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

* {
    box-sizing: border-box;
}

.page {
    min-height: 100%;
    display: grid;
    place-items: center;
    padding: 32px;
    background: #f5f7fb;
    color: #0f172a;
}

.card {
    width: min(420px, 100%);
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
    padding: 32px;
}

.brand {
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #2563eb;
    text-transform: uppercase;
    font-size: 12px;
}

h1 {
    margin: 12px 0 6px;
    font-size: 28px;
}

p {
    margin: 0 0 24px;
    color: #475569;
}

label {
    display: block;
    font-size: 13px;
    margin-bottom: 6px;
    color: #334155;
}

input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 14px;
    outline: none;
    transition: border 0.2s ease;
}

input:focus {
    border-color: #3b82f6;
}

.field {
    margin-bottom: 16px;
}

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
    font-size: 13px;
}

.remember {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0;
}

.row a,
.helper a {
    color: #2563eb;
    text-decoration: none;
}

.row a:hover,
.helper a:hover {
    text-decoration: underline;
}

.btn {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    background: #2563eb;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 20px rgba(37, 99, 235, 0.25);
}

.helper {
    margin-top: 14px;
    font-size: 13px;
    color: #475569;
    text-align: center;
}

.message {
    margin-top: 14px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13px;
}

.message.success {
    background: #ecfdf3;
    color: #166534;
}

.message.error {
    background: #fef2f2;
    color: #b91c1c;
}
</style>
