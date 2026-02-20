import { NextResponse } from "next/server";
import { seedOrders } from "@/lib/orders";
import { products } from "@/config/products";

export async function POST() {
  const sample = (products ?? []).slice(0, 40).map((p: any) => ({
    id: String(p.id),
    name: String(p.name),
    price: Number(p.price ?? 0),
  }));
  if (sample.length === 0) {
    return NextResponse.json({ error: "no products found to seed" }, { status: 400 });
  }
  const inserted = await seedOrders(sample, 30);
  return NextResponse.json({ inserted });
}
