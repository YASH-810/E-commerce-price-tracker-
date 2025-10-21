"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import ProductCard from "@/components/product_card";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", link: "", price: "" });
  const [loading, setLoading] = useState(false);

  // Real-time Firestore updates
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    });
    return () => unsub();
  }, []);

  // ➤ Add a new product and trigger backend scraper
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.link || !newProduct.price) {
      toast.error("Please fill all fields ⚠️");
      return;
    }

    try {
      // Step 1: Add product to Firestore
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: 0, // temporary until scraper updates
        targetPrice: Number(newProduct.price),
        link: newProduct.link,
        image: "/spinner.gif",
        createdAt: serverTimestamp(),
      });

      setNewProduct({ name: "", link: "", price: "" });

      // Step 2: Trigger Python backend scraper
      await toast.promise(
        fetch("https://e-commerce-price-tracker.onrender.com/update-products", { method: "POST" }),
        {
          loading: "Scraping product data...",
          success: "Product added and backend scraping started ✅",
          error: "Failed to trigger scraper ❌",
        }
      );
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("Failed to add product ❌");
    }
  };

  // ➤ Trigger scraper for all products
  const handleUpdateAllProducts = async () => {
    setLoading(true);
    try {
      await toast.promise(
        fetch("https://e-commerce-price-tracker.onrender.com/update-products", {
          method: "POST",
        }),
        {
          loading: "Updating all products...",
          success: "Scraper triggered — prices will update soon ✅",
          error: "Failed to trigger scraper ❌",
        }
      );
    } catch (err) {
      console.error("Error updating products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            E-Commerce Price Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and compare prices across platforms in real-time.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="gap-2"
            onClick={handleUpdateAllProducts}
            disabled={loading}
          >
            <RefreshCw size={18} />
            {loading ? "Updating..." : "Fetch & Update Prices"}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  Add New Product
                </DialogTitle>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Product Name
                    </p>
                    <Input
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Product URL
                    </p>
                    <Input
                      placeholder="https://example.com/product"
                      value={newProduct.link}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, link: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Target Price (₹)
                    </p>
                    <Input
                      placeholder="9999"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                  </div>
                  <Button className="w-full mt-3" onClick={handleAddProduct}>
                    Add Product
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <p className="text-gray-500">No products yet. Add one to start tracking!</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name || "Unnamed Product"}
              price={product.price || "Loading..."}
              lastPrice={product.lastPrice || product.price || 0}
              targetPrice={product.targetPrice }
              image={product.image}
              link={product.link || "#"}
              priceHistory={product.priceHistory || []} // ✅ pass priceHistory
              productId={product.id} // optional: needed if you want edit/delete
            />
          ))}
        </div>
      )}
    </div>
  );
}
