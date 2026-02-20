import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

/**
 * Tipo de item do pedido
 */
export type OrderItem = {
  id: string;
  product_id: string;
  price: number;
  quantity: number;
  created_at: string;
};

/**
 * Tipo de pedido
 */
export type Order = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  created_at: string;
  order_items: OrderItem[];
};

/**
 * Lista todos os pedidos (somente admin)
 */
export async function listOrders(): Promise<Order[]> {
  const supabase = await createSupabaseServerClient();

  // valida admin
  if (!(await isAdmin(supabase))) {
    throw new Error("forbidden");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      customer_name,
      customer_phone,
      created_at,
      order_items (
        id,
        product_id,
        price,
        quantity,
        created_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Order[]) ?? [];
}