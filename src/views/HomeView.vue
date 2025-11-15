<script setup lang="ts">
import { ref, onMounted } from 'vue'
import config from '@/config'
import SocialBar from '@/components/SocialBar.vue'

interface Hitokoto {
  hitokoto: string
  from?: string
  from_who?: string
}

const hitokoto = ref<string>('')
const hitokotoFrom = ref<string>('')
const hitokotoLoading = ref<boolean>(true)

const loadHitokoto = async () => {
  try {
    hitokotoLoading.value = true
    const res = await fetch('https://v1.hitokoto.cn/?encode=json')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const data = (await res.json()) as Hitokoto
    hitokoto.value = data.hitokoto
    const fromParts: string[] = []
    if (data.from_who) fromParts.push(data.from_who)
    if (data.from) fromParts.push(data.from)
    hitokotoFrom.value = fromParts.join(' · ')
  } catch (e) {
    console.error(e)
  } finally {
    hitokotoLoading.value = false
  }
}

onMounted(() => {
  if (config.style.hitokoto) loadHitokoto()
})
</script>

<template>
  <section class="w-full">
    <div
      class="mx-auto w-full max-w-[1040px] flex flex-col-reverse md:flex-row items-center justify-between gap-8 dark:text-white"
    >
      <div class="flex-1">
        <!-- 问候 -->
        <h1 class="text-3xl md:text-4xl tracking-wide text-center md:text-left mt-4 md:mt-0">
          Hi, I'm
          <span
            class="bg-linear-to-r from-sky-400 to-violet-500 dark:from-sky-300 dark:to-violet-400 bg-clip-text text-transparent font-semibold"
          >
            {{ config.author.name }}
          </span>
        </h1>

        <!-- 自我描述 -->
        <div v-if="config.author.description" class="mt-4 text-2xl text-center md:text-left">
          {{ config.author.description }}
        </div>

        <!-- 一言 -->
        <div
          v-if="config.style.hitokoto"
          class="flex w-full mt-1 md:mt-2 py-6 text-sm opacity-75 min-h-[120px]"
        >
          <p v-if="hitokotoLoading">Loading...</p>
          <p v-else class="leading-relaxed min-w-[280px] max-w-[480px]">
            <span class="block">「{{ hitokoto }}」</span>
            <span v-if="hitokotoFrom" class="block mt-1 text-right opacity-80"
              >—— {{ hitokotoFrom }}</span
            >
          </p>
        </div>
        <div v-else class="min-h-[50px]"></div>

        <!-- 社交平台 -->
        <div class="md:mt-2">
          <SocialBar />
        </div>
      </div>

      <!-- 头像 -->
      <div class="shrink-0">
        <img
          :src="config.author.avatar"
          alt="avatar"
          draggable="false"
          class="w-48 h-48 md:w-70 md:h-70 rounded-full object-cover ring-1 ring-white/40 shadow-xl"
        />
      </div>
    </div>
  </section>
</template>
