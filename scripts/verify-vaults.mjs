import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY environment variables.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runDiagnostics() {
  console.log("🔍 Running TheMaplePitch Database Diagnostics...\n")

  const { data: teams, error: teamError } = await supabase
    .from('teams')
    .select('league, name')

  if (teamError) {
    console.error("❌ Error fetching teams:", teamError.message)
  } else {
    console.log(`✅ Total Teams in Vault: ${teams.length}`)
    
    const leagueCounts = teams.reduce((acc, team) => {
      acc[team.league] = (acc[team.league] || 0) + 1
      return acc
    }, {})

    for (const [league, count] of Object.entries(leagueCounts)) {
      console.log(`   - ${league}: ${count} teams`)
    }
  }

  console.log("\n-------------------------------------------")

  const { count: playerCount, error: playerError } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })

  if (playerError) {
    console.error("❌ Error fetching player count:", playerError.message)
  } else {
    console.log(`✅ Total Canadian Player Profiles & Telemetry Records: ${playerCount ?? 0}`)
  }

  console.log("\n🏁 Diagnostics complete.")
}

runDiagnostics()
