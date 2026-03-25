<template>
    <div class="page">
        <div class="card wide">
            <div class="brand">Base64 Tools</div>
            <h1>Base64 Encoder / Decoder</h1>
            <p>Paste text or Base64 and convert instantly.</p>

            <div class="grid">
                <div class="field">
                    <label for="input">Input</label>
                    <textarea id="input" v-model="input" placeholder="Enter text or Base64" rows="8"></textarea>
                </div>

                <div class="field">
                    <label for="output">Output</label>
                    <textarea id="output" v-model="output" placeholder="Result" rows="8" readonly></textarea>
                </div>
            </div>

            <div class="actions">
                <button class="btn" @click="encode" :disabled="!input">
                    Encode → Base64
                </button>
                <button class="btn secondary" @click="decode" :disabled="!input">
                    Decode ← Base64
                </button>
                <button class="btn ghost" @click="clearAll" :disabled="!input && !output">
                    Clear
                </button>
                <button class="btn ghost" @click="copyOutput" :disabled="!output">
                    Copy output
                </button>
            </div>

            <div v-if="error" class="message error">{{ error }}</div>
            <div v-else-if="copied" class="message success">Copied to clipboard.</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

const encode = () => {
    error.value = ''
    copied.value = false
    try {
        const bytes = new TextEncoder().encode(input.value)
        let binary = ''
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte)
        })
        output.value = btoa(binary)
    } catch (err) {
        error.value = 'Failed to encode the input.'
    }
}

const decode = () => {
    error.value = ''
    copied.value = false
    try {
        const cleaned = input.value.replace(/\s+/g, '')
        const binary = atob(cleaned)
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
        output.value = new TextDecoder().decode(bytes)
    } catch (err) {
        output.value = ''
        error.value = 'Invalid Base64 string.'
    }
}

const clearAll = () => {
    input.value = ''
    output.value = ''
    error.value = ''
    copied.value = false
}

const copyOutput = async () => {
    error.value = ''
    copied.value = false
    try {
        await navigator.clipboard.writeText(output.value)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 1500)
    } catch (err) {
        error.value = 'Copy failed. Please copy manually.'
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
    width: min(720px, 100%);
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

textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 14px;
    outline: none;
    resize: vertical;
    transition: border 0.2s ease;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
        'Courier New', monospace;
}

textarea:focus {
    border-color: #3b82f6;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
}

.field {
    margin-bottom: 16px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
}

.btn {
    padding: 10px 16px;
    border-radius: 10px;
    border: none;
    background: #2563eb;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.btn.secondary {
    background: #0f172a;
}

.btn.ghost {
    background: #e2e8f0;
    color: #0f172a;
}

.btn:disabled {
    background: #94a3b8;
    color: #fff;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 20px rgba(37, 99, 235, 0.2);
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
