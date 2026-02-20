import { promises as fs } from "fs";
import path from "path";

export type OrderItem = {
  productId: string;
  name: string;
  price: number; // unit price
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  items: OrderItem[];
  total: number;
  source?: string;
  customer?: Record<string, any>;
};

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

async function ensureFile() {
  try {
    await fs.access(ORDERS_PATH);
  } catch {
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, "[]\n", "utf-8");
  }
}

export async function readOrders(): Promise<Order[]> {
  await ensureFile();
  const raw = await fs.readFile(ORDERS_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

export async function writeOrders(orders: Order[]) {
  await ensureFile();
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export function calcOrderTotal(items: OrderItem[]) {
  return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

export async function addOrder(orderInput: Omit<Order, "id" | "createdAt" | "total"> & { id?: string; createdAt?: string; total?: number; }): Promise<Order> {
  const orders = await readOrders();
  const id = orderInput.id ?? crypto.randomUUID();
  const createdAt = orderInput.createdAt ?? new Date().toISOString();
  const total = orderInput.total ?? calcOrderTotal(orderInput.items);

  const order: Order = { id, createdAt, items: orderInput.items, total, source: (orderInput as any).source, customer: (orderInput as any).customer };
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lastOrders: Order[];
};

export async function getAdminStats(limitTop = 10, limitLastOrders = 10): Promise<AdminStats> {
  const orders = await readOrders();
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  const agg = new Map<string, { productId: string; name: string; quantity: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items ?? []) {
      const key = item.productId;
      const current = agg.get(key) ?? { productId: key, name: item.name, quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += item.price * item.quantity;
      current.name = item.name || current.name;
      agg.set(key, current);
    }
  }

  const topProducts = Array.from(agg.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limitTop);

  const lastOrders = orders.slice(0, limitLastOrders);
  return { totalOrders, totalRevenue, topProducts, lastOrders };
}

export async function seedOrders(sampleProducts: Array<{ id: string; name: string; price: number }>, howMany = 20) {
  const orders = await readOrders();

  function pick<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const now = Date.now();
  const newOrders: Order[] = [];

  for (let i = 0; i < howMany; i++) {
    const itemsCount = 1 + Math.floor(Math.random() * 4);
    const items: OrderItem[] = [];
    const used = new Set<string>();

    for (let j = 0; j < itemsCount; j++) {
      const p = pick(sampleProducts);
      if (used.has(p.id) && sampleProducts.length > 1) continue;
      used.add(p.id);
      const quantity = 1 + Math.floor(Math.random() * 3);
      items.push({ productId: p.id, name: p.name, price: p.price, quantity });
    }

    const createdAt = new Date(now - Math.floor(Math.random() * 14) * 24 * 3600 * 1000).toISOString();
    const total = calcOrderTotal(items);

    newOrders.push({
      id: crypto.randomUUID(),
      createdAt,
      items,
      total,
    });
  }

  const merged = [...newOrders, ...orders];
  await writeOrders(merged);
  return newOrders.length;
}
