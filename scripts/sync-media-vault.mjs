// scripts/sync-media-vault.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * Downloads an image from a remote URL and uploads it to the Supabase Storage 'media' bucket.
 * @param {string} remoteUrl - Source image URL (API-Football, TheSportsDB, etc.)
 * @param {string} destinationPath - Path inside the bucket (e.g. 'teams/vancouver-rise.webp')
 * @returns {Promise<string|null>} - The public CDN URL from Supabase Storage
 */
async function uploadToMediaVault(remoteUrl, destinationPath) {
  try {
    // 1. Fetch remote image as arrayBuffer
    const response = await fetch(remoteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${remoteUrl} (Status: ${response.status})`);
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();

    // 2. Upload buffer directly to Supabase Storage 'media' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(destinationPath, buffer, {
        contentType,
        upsert: true, // Overwrite if it already exists
      });

    if (uploadError) {
      console.error(`❌ Upload error for ${destinationPath}:`, uploadError.message);
      return null;
    }

    // 3. Get the permanent Public CDN URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(destinationPath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error(`⚠️ Media Sync Failed for ${destinationPath}:`, err.message);
    return null;
  }
}

/**
 * Example function to sync team logos into Supabase Storage
 */
async function syncTeamLogos() {
  console.log('🚀 Starting Team Logo Sync to Supabase Storage...');

  // Fetch teams that have a temporary external logo URL or need storage hosting
  const { data: teams, error } = await supabase.from('teams').select('id, name, slug, logo_url');

  if (error || !teams) {
    console.error('Error fetching teams:', error?.message);
    return;
  }

  for (const team of teams) {
    if (team.logo_url && team.logo_url.startsWith('http') && !team.logo_url.includes('supabase.co')) {
      console.log(`⏳ Processing logo for ${team.name}...`);
      
      const fileExt = team.logo_url.endsWith('.svg') ? 'svg' : 'png';
      const storagePath = `teams/${team.slug}.${fileExt}`;

      const cdnUrl = await uploadToMediaVault(team.logo_url, storagePath);

      if (cdnUrl) {
        // Update database row with the new internal Supabase CDN link
        await supabase
          .from('teams')
          .update({ logo_url: cdnUrl })
          .eq('id', team.id);

        console.log(`✅ ${team.name} logo locked in Supabase Storage: ${cdnUrl}`);
      }
    }
  }

  console.log('🎉 Team Media Vault sync complete!');
}

syncTeamLogos().catch(console.error);
