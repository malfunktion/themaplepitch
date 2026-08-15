import {NextResponse} from 'next/server'; import {listMatches} from '@/lib/services/entities';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
export const revalidate=60; export async function GET(request:Request){if(!(await checkRateLimit(request)))return rateLimitResponse();const url=new URL(request.url);return NextResponse.json({data:await listMatches(url.searchParams.get('competition')??undefined),meta:{status:'demo'}},{headers:{'Cache-Control':'public, s-maxage=60, stale-while-revalidate=300'}})}
