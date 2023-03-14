import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('setup 🍏')

    return {
      async teardown() {
        console.log('teardown 🍎')
      },
    }
  },
}
