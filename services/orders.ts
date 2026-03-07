import { supabase } from "@/config/supabase";

const DB_COLLECTION = "orders";

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id?: string;
    total: number;
    source: string;
    customer: {
        name: string;
        phone: string;
        cep?: string;
        cpf?: string;
        city?: string;
    };
    items: OrderItem[];
    createdAt: Date;
}

// Add a new order
export async function addOrder(orderData: Omit<Order, "id" | "createdAt">): Promise<string> {
    try {
        const { data, error } = await supabase
            .from(DB_COLLECTION)
            .insert(orderData) // Supabase will auto-generate created_at if configured in DB, but we pass nothing to let it handle or we can pass new Date()
            .select()
            .single();

        if (error) throw error;
        return data.id as string;
    } catch (error) {
        console.error("Error adding order: ", error);
        throw error;
    }
}

// Get basic stats for dashboard
export async function getDashboardStats() {
    try {
        const { data, error } = await supabase
            .from(DB_COLLECTION)
            .select("*")
            .order("createdAt", { ascending: false });

        if (error) throw error;

        // Parse Supabase dates which come as ISO strings
        const orders = (data || []).map(doc => ({
            ...doc,
            createdAt: new Date(doc.createdAt || doc.created_at)
        })) as Order[];

        let totalRevenue = 0;
        let todayRevenue = 0;
        const topProductsMap = new Map<string, { productId: string; name: string; quantity: number; revenue: number }>();

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const order of orders) {
            totalRevenue += order.total;

            if (order.createdAt >= startOfToday) {
                todayRevenue += order.total;
            }

            for (const item of order.items) {
                const current = topProductsMap.get(item.productId) || {
                    productId: item.productId,
                    name: item.name,
                    quantity: 0,
                    revenue: 0,
                };
                current.quantity += item.quantity;
                current.revenue += (item.price * item.quantity);
                topProductsMap.set(item.productId, current);
            }
        }

        const topProducts = Array.from(topProductsMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return {
            totalOrders: orders.length,
            totalRevenue,
            todayRevenue,
            topProducts,
            lastOrders: orders.slice(0, 5),
        };
    } catch (error) {
        console.error("Error getting stats: ", error);
        return {
            totalOrders: 0,
            totalRevenue: 0,
            todayRevenue: 0,
            topProducts: [],
            lastOrders: [],
        };
    }
}
