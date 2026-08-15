import { NextResponse } from 'next/server'; import {listTeams} from '@/lib/services/entities';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
export const revalidate=300; export async function GET(request:Request){if(!(await checkRateLimit(request)))return rateLimitResponse();const url=new URL(request.url);return NextResponse.json({data:await listTeams(url.searchParams.get('competition')??undefined),meta:{status:'demo'}},{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600'}})}
