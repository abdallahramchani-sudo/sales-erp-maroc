import {db} from '@/lib/db';
export async function GET(){return Response.json(await db.customer.findMany({orderBy:{createdAt:'desc'}}))}
export async function POST(req:Request){const b=await req.json();return Response.json(await db.customer.create({data:{companyName:b.companyName,contactName:b.contactName||null,phone:b.phone||null,email:b.email||null,city:b.city||null}}),{status:201})}
