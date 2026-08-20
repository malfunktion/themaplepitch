// scripts/sync-media-vault.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function uploadToMediaVault(remoteUrl, destinationPath) {
  try {
    if (!remoteUrl || !remoteUrl.startsWith('http')) return null;

    const res = await fetch(remoteUrl);
    if (!res.ok) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/png';

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(destinationPath, buffer, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.error(`⚠️ Upload error for ${destinationPath}:`, uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(destinationPath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error(`❌ Error processing media ${remoteUrl}:`, err.message);
    return null;
  }
}

async function syncTeamLogos() {
  console.log('🏟️ [1/2] Starting Team Logo Sync to Supabase Storage...');
  
  const { data: teams, error } = await supabase.from('teams').select('id, name, slug, logo_url');
  if (error) {
    console.error('❌ Error fetching teams:', error.message);
    return;
  }

  let updatedCount = 0;
  for (const team of teams) {
    // If logo_url already points to our storage, skip
    if (team.logo_url && team.logo_url.includes('/storage/v1/object/public/media/')) {
      continue;
    }

    if (!team.logo_url) {
      console.log(`⚠️ Skipping ${team.name}: No source logo URL found.`);
      continue;
    }

    console.log(`⏳ Processing badge for ${team.name}...`);
    const ext = team.logo_url.split('.').pop().split('?')[0] || 'png';
    const destinationPath = `teams/${team.slug || team.id}.${ext}`;
    
    const cdnUrl = await uploadToMediaVault(team.logo_url, destinationPath);
    if (cdnUrl) {
      await supabase.from('teams').update({ logo_url: cdnUrl }).eq('id', team.id);
      console.log(`✅ Locked in Supabase Storage: ${cdnUrl}`);
      updatedCount++;
    }
    
    // Slight throttle
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`🎉 Team Logo sync finished! (${updatedCount} logos updated)\n`);
}

async function syncPlayerHeadshots() {
  console.log('⚽ [2/2] Starting Player Headshots & Avatars Sync to Supabase Storage...');

  const { data: players, error } = await supabase
    .from('players')
    .select('id, name, slug, metadata')
    .limit(200); // Batch size to manage processing

  if (error) {
    console.error('❌ Error fetching players:', error.message);
    return;
  }

  let updatedCount = 0;
  for (const player of players) {
    const rawPhoto = player.metadata?.photo;
    if (!rawPhoto || !rawPhoto.startsWith('http')) continue;
    
    // If already stored in our bucket, skip
    if (rawPhoto.includes('/storage/v1/object/public/media/')) continue;

    console.log(`⏳ Processing headshot for ${player.name}...`);
    const destinationPath = `players/${player.slug || player.id}.png`;

    const cdnUrl = await uploadToMediaVault(rawPhoto, destinationPath);
    if (cdnUrl) {
      const updatedMetadata = { ...(player.metadata || {}), photo: cdnUrl };
      await supabase.from('players').update({ metadata: updatedMetadata }).eq('id', player.id);
      console.log(`✅ Locked headshot: ${cdnUrl}`);
      updatedCount++;
    }

    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`🎉 Player Headshots sync finished! (${updatedCount} headshots updated)\n`);
}

async function runVaultSync() {
  await syncTeamLogos();
  await syncPlayerHeadshots();
  console.log('🚀 All Media Vault Synchronizations Complete!');
}

runVaultSync().catch(err => {
  console.error('❌ Fatal vault sync error:', err);
  process.exit(1);
});
