// studio-maplepitch/sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Function to dynamically determine the dataset based on the hostname
const getDynamicDataset = () => {
  // studio.themaplepitch.ca (production tree) -> 'production' dataset
  // dev-studio.themaplepitch.ca (or localhost) -> 'development' dataset
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Explicitly check the hostname. If it matches your expected dev studio URL
    // (You might need to adjust this if 'dev-studio' isn't correct)
    if (hostname.includes('dev-studio') || hostname === 'localhost') {
      console.log('Sanity Studio initializing with: [development] dataset (Hostname matched)');
      return 'development';
    }
  }

  // Fallback / Production default
  // This covers studio.themaplepitch.ca
  console.log('Sanity Studio initializing with: [production] dataset (Hostname fallback)');
  return 'production';
}

export default defineConfig({
  name: 'default',
  title: 'The Maple Pitch Website',

  projectId: 'uvf97j3d',
  // DYNAMICALLY SELECTING THE DATASET
  dataset: getDynamicDataset(), 

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
