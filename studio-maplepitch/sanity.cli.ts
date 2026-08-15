import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'uvf97j3d',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  deployment: {
    autoUpdates: true,
  },
})
