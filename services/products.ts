import { supabase } from "@/config/supabase";
import { Product } from "@/config/products";

// COLLECTION NAME
const DB_COLLECTION = "products";

// Fetch all products
export async function getProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase.from(DB_COLLECTION).select("*");
        if (error) throw error;
        return (data || []) as unknown as Product[];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// Fetch single product by ID
export async function getProductById(id: string | number): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from(DB_COLLECTION)
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as unknown as Product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

// Add a new product
export async function addProduct(product: Omit<Product, "id">) {
    try {
        const { data, error } = await supabase
            .from(DB_COLLECTION)
            .insert(product)
            .select()
            .single();

        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error("Error adding product: ", error);
        throw error;
    }
}

// Update a product
export async function updateProduct(id: string, product: Partial<Product>) {
    try {
        const { error } = await supabase
            .from(DB_COLLECTION)
            .update(product)
            .eq("id", id);

        if (error) throw error;
    } catch (error) {
        console.error("Error updating product: ", error);
        throw error;
    }
}

// Delete a product
export async function deleteProduct(id: string) {
    try {
        const { error } = await supabase
            .from(DB_COLLECTION)
            .delete()
            .eq("id", id);

        if (error) throw error;
    } catch (error) {
        console.error("Error deleting product: ", error);
        throw error;
    }
}

// Upload Image to Firebase Storage -> Supabase Storage
export async function uploadImage(file: File, path: string = "products"): Promise<string> {
    try {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const filePath = `${path}/${fileName}`;

        const { data, error } = await supabase.storage
            .from("products")
            .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error("Error uploading image: ", error);
        throw error;
    }
}
