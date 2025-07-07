import { useState, useEffect } import "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Laptop, Shirt, Home, Dumbbell, Book, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { CartSidebar } from "@/components/cart-sidebar";
import { CheckoutModal } from "@/components/checkout-modal";
import { Header } from "@/components/header";
import { Product, Category } from "@shared/schema";

export default function HomePage() {
  const [location, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("featured");

  // Parse query parameters
  const params = new URLSearchParams(location.split("?")[1] || "");
  const categoryId = params.get("categoryId");
  const search = params.get("search");
  const featured = params.get("featured");
  const ITEMS_PER_PAGE = 8;

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { categoryId, search, featured, limit: 100 }],
    queryFn: async () => {
      const url = new URL("/api/products", window.location.origin);
      url.searchParams.set("limit", "100"); // Get more products for pagination
      if (categoryId) url.searchParams.set("categoryId", categoryId);
      if (search) url.searchParams.set("search", search);
      if (featured) {
        const res = await fetch("/api/products/featured?limit=100");
        return res.json();
      }
      const res = await fetch(url.toString());
      return res.json();
    },
  });

  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
    enabled: !featured && !search && !categoryId,
  });

  // Sort products based on selection
  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-desc":
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "best-selling":
        return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case "featured":
      default:
        return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  };

  const rawProducts = featured || search || categoryId ? allProducts : featuredProducts;
  const sortedProducts = sortProducts(rawProducts);
  const totalProducts = sortedProducts.length;
  const displayedCount = (currentPage + 1) * ITEMS_PER_PAGE;
  const displayProducts = sortedProducts.slice(0, displayedCount);
  const hasMore = displayedCount < totalProducts;

  const categoryIcons = {
    electronics: Laptop,
    clothing: Shirt,
    home: Home,
    sports: Dumbbell,
    books: Book,
    gaming: Gamepad2,
  };

  const handleCategoryClick = (category: Category) => {
    setCurrentPage(0); // Reset to first page when changing category
    setLocation(`/?categoryId=${category.id}`);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(0); // Reset to first page when changing sort
  };

  const handleShopNow = () => {
    setLocation("/");
  };

  const handleViewDeals = () => {
    setCurrentPage(0);
    setLocation("/?featured=true");
  };

  // Reset page when URL parameters change
  useEffect(() => {
    setCurrentPage(0);
  }, [categoryId, search, featured]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onCartOpen={() => setCartOpen(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Discover Amazing Products
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Shop the latest collection with exclusive deals and fast shipping
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-50"
                  onClick={handleShopNow}
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={handleViewDeals}
                >
                  View Deals
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern shopping experience"
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-8">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Laptop;
              return (
                <Card
                  key={category.id}
                  className="text-center group cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="p-6">
                    <div className="bg-slate-100 rounded-full p-6 mb-4 group-hover:bg-blue-50 transition-colors">
                      <IconComponent className="h-8 w-8 text-slate-600 group-hover:text-blue-600 mx-auto" />
                    </div>
                    <h4 className="font-medium text-slate-800">{category.name}</h4>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                {search ? `Search Results for "${search}"` : 
                 featured ? "Featured Products" : 
                 categoryId ? `${categories.find(c => c.id.toString() === categoryId)?.name || "Category"} Products` : "Featured Products"}
              </h3>
              {categoryId && (
                <p className="text-slate-600 mt-1">
                  Showing products in {categories.find(c => c.id.toString() === categoryId)?.name} category
                  <Button
                    variant="link"
                    className="p-0 h-auto ml-2 text-blue-600"
                    onClick={() => setLocation("/")}
                  >
                    Clear filter
                  </Button>
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Sort by: Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="best-selling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" onClick={handleLoadMore}>
                Load More Products ({displayedCount} of {totalProducts})
              </Button>
            </div>
          )}

          {displayProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No products found.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentPage(0);
                  setLocation("/");
                }} 
                className="mt-4"
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ModernCart</h3>
              <p className="text-slate-300 mb-4">
                This is for personal portfolio demonstration showcasing full-stack e-commerce development skills.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-slate-300">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Developer</h4>
              <div className="text-slate-300 space-y-2">
                <p><strong>Reaishma N</strong></p>
                <p>
                  <a 
                    href="mailto:vra.9618@gmail.com" 
                    className="hover:text-white transition-colors"
                  >
                    vra.9618@gmail.com
                  </a>
                </p>
                <p>
                  <a 
                    href="https://github.com/Reaishma" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub Profile
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>Personal Portfolio Demonstration • Built with React, TypeScript, Express.js & PostgreSQL</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckoutOpen={() => setCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
