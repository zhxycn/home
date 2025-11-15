<script setup lang="ts">
import { ref, onMounted } from 'vue'
import config from '@/config'
import ParticleBackground from '@/components/ParticleBackground.vue'

const year = ref<number | null>(null)

onMounted(() => {
  if (config.style.cursor_effects) import('./assets/cursor-effects')
  year.value = new Date().getFullYear()
})
</script>

<template>
  <!-- 背景 -->
  <div>
    <!-- 底色 -->
    <div class="fixed inset-0 -z-60 pointer-events-none bg-[#F3F4F5] dark:bg-[#1C1D1E]"></div>

    <!-- 背景图 -->
    <div
      v-if="config.style.background.image"
      :style="{ backgroundImage: `url('${config.style.background.image}')` }"
      class="fixed inset-0 -z-50 pointer-events-none bg-center bg-cover bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-inherit before:filter before:blur-[14px] before:saturate-[.95] before:opacity-[.85] before:mask-[radial-gradient(circle_at_center,rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_85%,rgba(0,0,0,0.4)_100%)] after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_35%,rgba(0,0,0,0.4)_85%,rgba(0,0,0,0.6)_100%)]"
    ></div>

    <!-- 粒子 -->
    <div v-if="config.style.background.particle" class="fixed inset-0 -z-40">
      <ParticleBackground />
    </div>
  </div>

  <div
    class="flex flex-col min-h-screen md:items-center md:justify-start w-full box-border text-[15px] leading-[1.6] transition-colors duration-500"
  >
    <!-- 内容 -->
    <main class="flex items-center justify-center grow shrink-0 basis-auto p-4 w-full box-border">
      <div
        class="w-full max-w-[1280px] mx-auto p-4 box-border flex flex-col items-center justify-center"
      >
        <RouterView />
      </div>
    </main>

    <!-- 页脚 -->
    <footer
      class="flex mb-4 items-center justify-center gap-4 w-full box-border text-center text-xs text-neutral-700 dark:text-neutral-300"
    >
      <div>© {{ year }} {{ config.author.name.toUpperCase() }}</div>
      <div v-if="config.footer.icp">{{ config.footer.icp }}</div>
    </footer>
  </div>
</template>
