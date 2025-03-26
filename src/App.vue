<script setup lang="ts">
const content = ref('')
const loading = ref(false)

loading.value = true
fetch('http://localhost:3000/md').then(d => d.text()).then(text => {
  content.value = text
  loading.value = false
})
</script>

<template>
  <main class="h-screen overflow-hidden p-2 box-border">
    <Chat class="max-w-[960px] mx-auto" :content="content" :loading="loading"></Chat>
  </main>
</template>

<style lang="scss"></style>
