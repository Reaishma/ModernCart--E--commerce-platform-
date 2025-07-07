import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product, Category, Order } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.string().min(1, "Stock is required"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Queries
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Product form
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      imageUrl: "",
      categoryId: "",
      stock: "",
      isFeatured: false,
      isActive: true,
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        ...data,
        price: data.price,
        originalPrice: data.originalPrice || null,
        categoryId: parseInt(data.categoryId),
        stock: parseInt(data.stock),
      };
      const res = await apiRequest("POST", "/api/products", productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product created",
        description: "Product has been created successfully.",
      });
      setIsProductModalOpen(false);
      form.reset();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        ...data,
        price: data.price,
        originalPrice: data.originalPrice || null,
        categoryId: parseInt(data.categoryId),
        stock: parseInt(data.stock),
      };
      const res = await apiRequest("PUT", `/api/products/${editingProduct!.id}`, productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
      setIsProductModalOpen(false);
      setEditingProduct(null);
      form.reset();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
    },
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      originalPrice: product.originalPrice || "",
      imageUrl: product.imageUrl,
      categoryId: product.categoryId?.toString() || "",
      stock: product.stock.toString(),
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate(data);
    } else {
      createProductMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 text-white">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="p-6 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === "dashboard" ? "bg-slate-700" : "hover:bg-slate-700"
              }`}
            >
              <Package className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === "products" ? "bg-slate-700" : "hover:bg-slate-700"
              }`}
            >
              <Package className="h-5 w-5" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === "orders" ? "bg-slate-700" : "hover:bg-slate-700"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Orders</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 bg-white border-b">
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "products" && "Products"}
              {activeTab === "orders" && "Orders"}
            </h1>
          </div>

          <div className="p-6">
            {activeTab === "dashboard" && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 text-sm">Total Orders</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {stats?.totalOrders || 0}
                          </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 text-sm">Revenue</p>
                          <p className="text-2xl font-bold text-slate-800">
                            ${stats?.totalRevenue || "0"}
                          </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 text-sm">Products</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {stats?.totalProducts || 0}
                          </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Package className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 text-sm">Customers</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {stats?.totalCustomers || 0}
                          </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                          <Users className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingProduct(null); form.reset(); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? "Edit Product" : "Add New Product"}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="slug"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Slug</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="originalPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Original Price</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="stock"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingProduct ? "Update" : "Create"} Product
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog> 
</div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-slate-500">{product.slug}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Orders</h2>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.userId}</TableCell>
                          <TableCell>${order.total}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "processing"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

                  
        
