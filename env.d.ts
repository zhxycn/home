/// <reference types="vite/client" />
declare module 'virtual:config' {
  const value: import('@/config').Index
  export default value
}
