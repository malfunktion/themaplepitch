import {NextResponse} from 'next/server'; import {listWire} from '@/lib/services/entities';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { DATASET } from '@/lib/dataStatus';
export const revalidate=30; export async function GET(request:Request){if(!(await checkRateLimit(request)))return rateLimitResponse();return NextResponse.json({data:await listWire(),meta:{status:'demo',updatedAt:DATASET.updatedAt}},{headers:{'Cache-Control':'public, s-maxage=30, stale-while-revalidate=120'}})}
