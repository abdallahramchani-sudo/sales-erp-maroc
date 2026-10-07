import {db} from '@/lib/db';
export async function GET(){return Response.json(await db.order.findMany({include:{customer:true,items:true},orderBy:{createdAt:'desc'}}))}
