import {db} from '@/lib/db';
export async function GET(){return Response.json(await db.product.findMany({where:{active:true},orderBy:{name:'asc'}}))}
export async function POST(req:Request){const b=await req.json();return Response.json(await db.product.create({data:{sku:b.sku,name:b.name,category:b.category||null,price:b.price,taxRate:20,stock:b.stock||0}}),{status:201})}
