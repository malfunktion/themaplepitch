// scripts/sync-all-media-forced.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function slugify(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function downloadAndUpload(url, destinationPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(destinationPath, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`❌ Storage upload failed for ${destinationPath}:`, uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(destinationPath);
    return data.publicUrl;
  } catch (err) {
    console.error(`❌ Error processing image from ${url}:`, err.message);
    return null;
  }
}

async function runForcedSync() {
  console.log('🚀 Starting Non-Destructive Media Vault Sync...');

  // 1. PROCESS TEAMS & LOGOS
  const { data: teams, error: teamErr } = await supabase
    .from('teams')
    .select('id, name, slug, logo_url');

  if (teamErr) {
    console.error('❌ Error fetching teams:', teamErr.message);
    return;
  }

  console.log(`📊 Found ${teams.length} teams. Processing crests...`);
  for (const team of teams) {
    let sourceLogo = team.logo_url;

    // Skip downloading if image is already cached in Supabase Storage
    if (sourceLogo && sourceLogo.includes('/storage/v1/object/public/media/')) {
      continue;
    }

    if (!sourceLogo || !sourceLogo.startsWith('http')) {
      sourceLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=0D1117&color=fff&size=256&bold=true`;
    }

    console.log(`⏳ Processing crest for ${team.name}...`);
    const dest = `teams/${team.slug || slugify(team.name)}.png`;
    const cdnUrl = await downloadAndUpload(sourceLogo, dest);

    if (cdnUrl) {
      await supabase.from('teams').update({ logo_url: cdnUrl }).eq('id', team.id);
      console.log(`✅ Locked Team Logo: ${cdnUrl}`);
    }

    await new Promise(r => setTimeout(r, 100));
  }

  // 2. PROCESS PLAYERS & HEADSHOTS
  const { data: players, error: playerErr } = await supabase
    .from('players')
    .select('id, name, slug, metadata');

  if (playerErr) {
    console.error('❌ Error fetching players:', playerErr.message);
    return;
  }

  console.log(`📊 Found ${players.length} players. Processing headshots...`);
  let updatedCount = 0;

  for (const player of players) {
    let rawPhoto = player.metadata?.photo;

    // Skip downloading if headshot is already cached in Supabase Storage
    if (rawPhoto && rawPhoto.includes('/storage/v1/object/public/media/')) {
      continue;
    }

    if (!rawPhoto || !rawPhoto.startsWith('http')) {
      rawPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=1B2A4A&color=00FF66&size=256&bold=true`;
    }

    console.log(`⏳ Processing headshot for ${player.name}...`);
    const dest = `players/${player.slug || slugify(player.name)}.png`;
    const cdnUrl = await downloadAndUpload(rawPhoto, dest);

    if (cdnUrl) {
      const updatedMetadata = { ...(player.metadata || {}), photo: cdnUrl };
      await supabase.from('players').update({ metadata: updatedMetadata }).eq('id', player.id);
      console.log(`✅ Locked Player Headshot: ${cdnUrl}`);
      updatedCount++;
    }

    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`🎉 Media Sync Complete! Updated ${updatedCount} player files and all team crests without deleting history.`);
}

runForcedSync().catch(err => {
  console.error('❌ Fatal sync error:', err);
  process.exit(1);
});
