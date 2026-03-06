import { db } from "@/config/firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";
import { Product } from "@/config/products";

// COLLECTION NAME
const DB_COLLECTION = "products";

// Fetch all products
export async function getProducts(): Promise<Product[]> {
    try {
        const querySnapshot = await getDocs(collection(db, DB_COLLECTION));
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
            // The id in our Mock was a number, but Firestore uses strings. 
            // We'll keep the string ID for the real implementation.
            products.push({ id: doc.id, ...doc.data() } as unknown as Product);
        });
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// Fetch single product by ID
export async function getProductById(id: string | number): Promise<Product | null> {
    try {
        const docRef = doc(db, DB_COLLECTION, String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as unknown as Product;
        } else {
            console.log("No such product found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

// Add a new product
export async function addProduct(product: Omit<Product, "id">) {
    try {
        const docRef = await addDoc(collection(db, DB_COLLECTION), product);
        return docRef.id;
    } catch (error) {
        console.error("Error adding product: ", error);
        throw error;
    }
}

// Update a product
export async function updateProduct(id: string, product: Partial<Product>) {
    try {
        const docRef = doc(db, DB_COLLECTION, id);
        await updateDoc(docRef, product);
    } catch (error) {
        console.error("Error updating product: ", error);
        throw error;
    }
}

// Delete a product
export async function deleteProduct(id: string) {
    try {
        const docRef = doc(db, DB_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting product: ", error);
        throw error;
    }
}

// Upload Image to Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

export async function uploadImage(file: File, path: string = "products"): Promise<string> {
    try {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const storageRef = ref(storage, `${path}/${fileName}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image: ", error);
        throw error;
    }
}
