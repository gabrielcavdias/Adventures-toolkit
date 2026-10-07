<script setup lang="ts"></script>
<template>
  <ul class="mt-5 mx-2 gap-2 text-gray-100 grid grid-cols-2 lg:grid-cols-3">
    <li>
      <RouterLink class="bg-neutral-800 px-4 py-6 rounded-md grid gap-2" to="/npcs">
        Inimigos e NPCs
      </RouterLink>
    </li>
    <li>
      <span class="relative bg-neutral-800 px-4 py-6 rounded-md grid gap-2">
        Condições <span class="absolute bottom-1 right-2 text-amber-400">Em breve!</span>
      </span>
    </li>
  </ul>
</template>
