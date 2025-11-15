<script setup lang="ts">
import { computed } from 'vue'
import config from '@/config'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faGithub,
  faXTwitter,
  faTelegram,
  faLinkedin,
  faSteam,
  faBilibili,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faHouse } from '@fortawesome/free-solid-svg-icons'

library.add(faGithub, faXTwitter, faTelegram, faLinkedin, faSteam, faBilibili, faEnvelope, faHouse)

type Link = { label: string; url: string; icon: ['fab' | 'fas', string]; color?: string }

const email = config.author.email as string | undefined
const blog = (config.author['blog'] as string | undefined) || undefined
const github = config.author.github as string | undefined
const twitter = (config.author['twitter'] as string | undefined) || undefined
const telegram = (config.author['telegram'] as string | undefined) || undefined
const linkedin = (config.author['linkedin'] as string | undefined) || undefined
const steam = (config.author['steam'] as string | undefined) || undefined
const bilibili = (config.author['bilibili'] as string | undefined) || undefined

const links = computed<Link[]>(() => {
  const arr: Link[] = []
  if (blog)
    arr.push({
      label: 'Blog',
      url: blog,
      icon: ['fas', 'house'],
      color: '#EDAF08',
    })
  if (github)
    arr.push({
      label: 'GitHub',
      url: github.startsWith('http') ? github : `https://github.com/${github}`,
      icon: ['fab', 'github'],
      color: '#181717',
    })
  if (twitter)
    arr.push({
      label: 'X',
      url: twitter.startsWith('http') ? twitter : `https://x.com/${twitter}`,
      icon: ['fab', 'x-twitter'],
      color: '#000000',
    })
  if (telegram)
    arr.push({
      label: 'Telegram',
      url: telegram.startsWith('http') ? telegram : `https://t.me/${telegram}`,
      icon: ['fab', 'telegram'],
      color: '#26A5E4',
    })
  if (linkedin)
    arr.push({
      label: 'LinkedIn',
      url: linkedin.startsWith('http') ? linkedin : `https://www.linkedin.com/in/${linkedin}`,
      icon: ['fab', 'linkedin'],
      color: '#0077B5',
    })
  if (steam)
    arr.push({
      label: 'Steam',
      url: steam.startsWith('http') ? steam : `https://steamcommunity.com/profiles/${steam}`,
      icon: ['fab', 'steam'],
      color: '#075B8E',
    })
  if (bilibili)
    arr.push({
      label: 'Bilibili',
      url: bilibili.startsWith('http') ? bilibili : `https://space.bilibili.com/${bilibili}`,
      icon: ['fab', 'bilibili'],
      color: '#00A1D6',
    })
  if (email)
    arr.push({
      label: 'Email',
      url: `mailto:${email}`,
      icon: ['fas', 'envelope'],
      color: '#EA4335',
    })
  return arr
})
</script>

<template>
  <nav class="flex items-center justify-center md:justify-start gap-2">
    <a
      v-for="item in links"
      :key="item.label"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="item.label"
      class="group relative w-10 h-10 inline-flex items-center justify-center rounded-full text-[24px] text-gray-700/90 dark:text-gray-200/90 ring-1 ring-black/3 dark:ring-white/20 dark:bg-white/85 hover:-translate-y-0.5 transition-transform duration-150 hover:bg-(--bg-color)"
      :style="{
        '--bg-color': item.color,
        '--icon-color': item.color,
      }"
    >
      <FontAwesomeIcon :icon="item.icon" class="text-(--icon-color) group-hover:text-[#E8E8E8]" />
      <span
        class="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-10 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-neutral-900/85 text-white dark:bg-white/85 dark:text-black ring-1 ring-black/10 dark:ring-white/20"
      >
        {{ item.label }}
      </span>
    </a>
  </nav>
</template>
