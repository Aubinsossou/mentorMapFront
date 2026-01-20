<script setup>
    defineProps({
  titre: String,
  age: Number,
})

</script>

<template>

       <header class="header">
        <div class="container" style="display: flex;">
          <div class="logo">
            <span class="logo-icon">🎓</span>
            <span class="logo-text">{{ titre }}</span>
          </div>
         <!--  <nav class="nav">
            <button @click="currentPage = 'login'" class="nav-link">Connexion</button>
            <button @click="currentPage = 'register'" class="btn-primary">Inscription</button>
          </nav> -->
        </div>
      </header>

</template>
<style></style>