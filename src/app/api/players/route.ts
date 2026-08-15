import { NextResponse } from 'next/server'; import { listPlayers } from '@/lib/services/entities';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { DATASET } from '@/lib/dataStatus';
export const revalidate = 300;
export async function GET(request: Request){if(!(await checkRateLimit(request)))return rateLimitResponse();const url=new URL(request.url);const data=await listPlayers({competitionId:url.searchParams.get('competition')??undefined,position:url.searchParams.get('position')??undefined,province:url.searchParams.get('province')??undefined});return NextResponse.json({data,meta:{status:'demo',updatedAt:DATASET.updatedAt,source:DATASET.source}},{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600'}})}
