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
 * @param {string} remoteUrl - Source image URL
 * @param {string} destinationPath - Path inside the bucket (e.g. 'teams/vancouver-rise.png' or 'players/jonathan-david.jpg')
 * @returns {Promise<string|null>} - The public CDN URL from Supabase Storage
 */
async function uploadToMediaVault(remoteUrl, destinationPath) {
  try {
    const response = await fetch(remoteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${remoteUrl} (Status: ${response.status})`);
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(destinationPath, buffer, {
        contentType,
        upsert: true, // Overwrite if file already exists
      });

    if (uploadError) {
      console.error(`❌ Upload error for ${destinationPath}:`, uploadError.message);
      return null;
    }

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
 * 1. Sync Team Logos & Crests
 */
async function syncTeamLogos() {
  console.log('\n🏟️  [1/2] Starting Team Logo Sync to Supabase Storage...');

  const { data: teams, error } = await supabase.from('teams').select('*');

  if (error || !teams) {
    console.error('❌ Error fetching teams:', error?.message);
    return;
  }

  console.log(`📊 Found ${teams.length} teams in Supabase.`);
  let syncedCount = 0;

  for (const team of teams) {
    const currentLogo = team.logo_url || team.logo || team.crest_url;

    if (!currentLogo) {
      console.log(`⚠️  Skipping ${team.name}: No logo URL found in database row.`);
      continue;
    }

    if (currentLogo.includes('supabase.co')) {
      console.log(`ℹ️  Skipping ${team.name}: Logo is already hosted on Supabase CDN.`);
      continue;
    }

    if (currentLogo.startsWith('http')) {
      console.log(`⏳ Processing logo for ${team.name}... (${currentLogo})`);

      const fileExt = currentLogo.split('.').pop()?.split('?')[0] || 'png';
      const storagePath = `teams/${team.slug || team.id}.${fileExt}`;

      const cdnUrl = await uploadToMediaVault(currentLogo, storagePath);

      if (cdnUrl) {
        const updatePayload = { logo_url: cdnUrl };
        if ('logo' in team) updatePayload.logo = cdnUrl;

        await supabase
          .from('teams')
          .update(updatePayload)
          .eq('id', team.id);

        console.log(`✅ ${team.name} logo locked in Supabase Storage: ${cdnUrl}`);
        syncedCount++;
      }
    } else {
      console.log(`⚠️  Skipping ${team.name}: Invalid logo URL format (${currentLogo}).`);
    }
  }

  console.log(`🎉 Team Media Vault sync finished! (${syncedCount} logos updated)\n`);
}

/**
 * 2. Sync Player Headshots & Avatars
 */
async function syncPlayerHeadshots() {
  console.log('⚽ [2/2] Starting Player Headshots & Avatars Sync to Supabase Storage...');

  const { data: players, error } = await supabase.from('players').select('*');

  if (error || !players) {
    console.error('❌ Error fetching players:', error?.message);
    return;
  }

  console.log(`📊 Found ${players.length} players in Supabase.`);
  let syncedCount = 0;

  for (const player of players) {
    const currentAvatar = player.avatar_url || player.photo_url || player.image_url || player.headshot_url;

    if (!currentAvatar) {
      console.log(`⚠️  Skipping ${player.name}: No avatar URL found in database row.`);
      continue;
    }

    if (currentAvatar.includes('supabase.co')) {
      console.log(`ℹ️  Skipping ${player.name}: Headshot is already hosted on Supabase CDN.`);
      continue;
    }

    if (currentAvatar.startsWith('http')) {
      console.log(`⏳ Processing headshot for ${player.name}...`);

      const fileExt = currentAvatar.split('.').pop()?.split('?')[0] || 'jpg';
      const storagePath = `players/${player.slug || player.id}.${fileExt}`;

      const cdnUrl = await uploadToMediaVault(currentAvatar, storagePath);

      if (cdnUrl) {
        const updatePayload = {};
        if ('avatar_url' in player) updatePayload.avatar_url = cdnUrl;
        if ('photo_url' in player) updatePayload.photo_url = cdnUrl;
        if ('image_url' in player) updatePayload.image_url = cdnUrl;

        if (Object.keys(updatePayload).length === 0) {
          updatePayload.avatar_url = cdnUrl;
        }

        await supabase
          .from('players')
          .update(updatePayload)
          .eq('id', player.id);

        console.log(`✅ ${player.name} headshot locked in Supabase Storage: ${cdnUrl}`);
        syncedCount++;
      }
    } else {
      console.log(`⚠️  Skipping ${player.name}: Invalid avatar URL format (${currentAvatar}).`);
    }
  }

  console.log(`🎉 Player Media Vault sync finished! (${syncedCount} headshots updated)\n`);
}

async function runMasterMediaVaultSync() {
  await syncTeamLogos();
  await syncPlayerHeadshots();
  console.log('🚀 All Team Logos and Player Headshots Sync Complete!');
}

runMasterMediaVaultSync().catch(console.error);
