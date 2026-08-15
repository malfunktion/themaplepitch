# Supabase security checklist

Before connecting live data:

1. Enable Row Level Security on every public table.
2. Create explicit `select` policies; default-deny everything else.
3. Keep service-role credentials server-only.
4. Never place provider/API secrets in `NEXT_PUBLIC_*` variables.
5. Add audit fields (`created_at`, `updated_at`, `source_id`, `source_url`) to sourced data.
6. Add role-based policies for scout reports and private player information.
7. Treat youth/player-sensitive records as private by default.

Example baseline policy pattern:

```sql
alter table public.players enable row level security;
create policy "public players are readable" on public.players
  for select using (published = true);
```

Do not apply this blindly: adapt it to the final schema and permissions model.
