// scripts/sync-media-vault.mjs
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY);


async function uploadToMediaVault(sourceUrl, destinationPath) {
  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('media')
      .upload(destinationPath, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error(`Storage upload error for ${destinationPath}:`, error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(destinationPath);

    return publicUrl;
  } catch (err) {
    console.error(`Failed to process image ${sourceUrl}:`, err.message);
    return null;
  }
}

async function syncAllPlayerHeadshots() {
  console.log('🏟️ Starting Full Player Headshot Vault Sync...');
  
  // Fetch players in chunks or comprehensive selection
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .limit(1000);

  if (error) {
    console.error('❌ Error fetching players:', error.message);
    return;
  }

  console.log(`📊 Found ${players.length} total players in database. Inspecting avatars...`);

  let syncedCount = 0;
  let skippedCount = 0;

  for (const player of players) {
    const rawPhoto = player.metadata?.photo || player.photo_url;
    
    if (!rawPhoto || !rawPhoto.startsWith('http')) {
      skippedCount++;
      continue;
    }
    
    // If already stored in our Supabase bucket, skip
    if (rawPhoto.includes('/storage/v1/object/public/media/')) {
      skippedCount++;
      continue;
    }

    console.log(`⏳ Processing headshot for ${player.name}...`);
    const destinationPath = `players/${player.slug || player.id}.png`;

    const cdnUrl = await uploadToMediaVault(rawPhoto, destinationPath);
    if (cdnUrl) {
      const updatedMetadata = { ...(player.metadata || {}), photo: cdnUrl };
      await supabase
        .from('players')
        .update({ metadata: updatedMetadata })
        .eq('id', player.id);
        
      console.log(`✅ Locked headshot: ${cdnUrl}`);
      syncedCount++;
    }

    // Rate-limit throttle to protect network
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`🎉 Player Headshots sync finished! (${syncedCount} newly locked, ${skippedCount} skipped/no source URL)\n`);
}

async function syncAllTeamLogos() {
  console.log('🏟️ Starting Full Team Logo Vault Sync...');
  
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*');

  if (error) {
    console.error('❌ Error fetching teams:', error.message);
    return;
  }

  console.log(`📊 Found ${teams.length} teams in Supabase. Inspecting crests...`);

  let logoSynced = 0;

  for (const team of teams) {
    const rawLogo = team.logo_url || team.metadata?.logo;
    
    if (!rawLogo || !rawLogo.startsWith('http')) {
      console.log(`⚠️ Skipping ${team.name}: No valid source logo URL found in row.`);
      continue;
    }

    if (rawLogo.includes('/storage/v1/object/public/media/')) {
      continue;
    }

    console.log(`⏳ Processing badge for ${team.name}...`);
    const destinationPath = `teams/${team.slug || team.id}.png`;

    const cdnUrl = await uploadToMediaVault(rawLogo, destinationPath);
    if (cdnUrl) {
      await supabase
        .from('teams')
        .update({ logo_url: cdnUrl })
        .eq('id', team.id);
        
      console.log(`✅ Locked team logo in Supabase Storage: ${cdnUrl}`);
      logoSynced++;
    }

    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`🎉 Team Logo sync finished! (${logoSynced} logos locked)\n`);
}

async function runMasterVaultSync() {
  await syncAllTeamLogos();
  await syncAllPlayerHeadshots();
  console.log('🚀 All Media Vault Synchronizations Complete!');
}

runMasterVaultSync().catch(err => {
  console.error('❌ Fatal vault sync error:', err);
  process.exit(1);
});
