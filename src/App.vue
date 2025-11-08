<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="bg-neutral-800 py-3 text-gray-100">
    <div class="flex items-center font-[Comic_Neue]">
      <img src="./assets/logo.png" alt="Biblioteca Teurgista" class="w-20 ml-auto" />
      <p class="mr-auto text-3xl">Adventure's toolkit</p>
    </div>
    <ul class="flex justify-center gap-4 text-lg">
      <li>
        <RouterLink
          to="/"
          class="hover:text-purple-300 transition"
          :active-class="'text-purple-500'"
        >
          Magias
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/personagens"
          class="hover:text-purple-300 transition"
          :active-class="'text-purple-500'"
        >
          Personagens
        </RouterLink>
      </li>
    </ul>
  </header>
  <div class="mb-4">
    <RouterView />
  </div>
</template>
