import config from 'virtual:config'

export type Index = {
  site: {
    title: string
    description: string
    icon: string
  }
  author: {
    name: string
    avatar: string
    description?: string
    email?: string
    blog?: string
    github?: string
    twitter?: string
    telegram?: string
    linkedin?: string
    steam?: string
    bilibili?: string
  }
  footer: {
    icp: string
  }
  style: {
    background: {
      image?: string
      particle: boolean
    }
    cursor_effects: boolean
    hitokoto: boolean
  }
  [k: string]: unknown
}

export default config as Index
