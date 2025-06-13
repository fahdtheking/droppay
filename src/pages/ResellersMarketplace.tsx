import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  DollarSign, 
  Package, 
  Truck, 
  Eye, 
  Plus,
  Minus,
  ExternalLink,
  Copy,
  Share2,
  BarChart3,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import AgentSlot from '../components/AgentSlot';

const ResellersMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All Products', count: 1247 },
    { id: 'electronics', label: 'Electronics', count: 324 },
    { id: 'fashion', label: 'Fashion', count: 189 },
    { id: 'home', label: 'Home & Garden', count: 156 },
    { id: 'health', label: 'Health & Beauty', count: 234 },
    { id: 'sports', label: 'Sports & Outdoors', count: 145 },
    { id: 'books', label: 'Books & Media', count: 89 },
    { id: 'automotive', label: 'Automotive', count: 110 }
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      supplier: 'TechCorp Electronics',
      supplierRating: 4.8,
      price: 89.99,
      cost: 45.00,
      commission: 15,
      commissionAmount: 13.50,
      category: 'electronics',
      rating: 4.6,
      reviews: 234,
      sales: 1456,
      inventory: 245,
      shipping: 'Free shipping',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Noise Cancelling', 'Wireless', '20hr Battery'],
      description: 'Premium wireless headphones with active noise cancellation and superior sound quality.',
      supplierUrl: 'droppay.com/store/techcorp',
      trending: true
    },
    {
      id: 2,
      name: 'Smart Fitness Tracker',
      supplier: 'HealthTech Solutions',
      supplierRating: 4.9,
      price: 129.99,
      cost: 65.00,
      commission: 20,
      commissionAmount: 26.00,
      category: 'health',
      rating: 4.7,
      reviews: 189,
      sales: 892,
      inventory: 89,
      shipping: 'Free shipping',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Heart Rate Monitor', 'GPS', 'Waterproof'],
      description: 'Advanced fitness tracker with comprehensive health monitoring features.',
      supplierUrl: 'droppay.com/store/healthtech',
      trending: false
    },
    {
      id: 3,
      name: 'Portable Phone Charger',
      supplier: 'PowerMax Accessories',
      supplierRating: 4.5,
      price: 34.99,
      cost: 18.00,
      commission: 12,
      commissionAmount: 4.20,
      category: 'electronics',
      rating: 4.3,
      reviews: 567,
      sales: 2341,
      inventory: 156,
      shipping: '$3.99 shipping',
      image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Fast Charging', 'Compact', 'LED Display'],
      description: 'High-capacity portable charger with fast charging technology.',
      supplierUrl: 'droppay.com/store/powermax',
      trending: true
    },
    {
      id: 4,
      name: 'Organic Skincare Set',
      supplier: 'Natural Beauty Co',
      supplierRating: 4.7,
      price: 79.99,
      cost: 35.00,
      commission: 25,
      commissionAmount: 20.00,
      category: 'health',
      rating: 4.8,
      reviews: 145,
      sales: 678,
      inventory: 78,
      shipping: 'Free shipping',
      image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Organic', 'Cruelty-Free', 'All Skin Types'],
      description: 'Complete organic skincare routine with natural ingredients.',
      supplierUrl: 'droppay.com/store/naturalbeauty',
      trending: false
    }
  ];

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const addToCart = (product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const generateUniqueLink = (product: any) => {
    const baseUrl = product.supplierUrl;
    const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
    const resellerCode = 'your-reseller-id'; // This would be dynamic
    return `${baseUrl}/${productSlug}?ref=${resellerCode}`;
  };

  const copyUniqueLink = (product: any) => {
    const link = generateUniqueLink(product);
    navigator.clipboard.writeText(`https://${link}`);
    alert('Unique tracking link copied to clipboard!');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resellers Marketplace</h1>
            <p className="text-gray-600">Discover products to resell and earn commissions</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Store size={16} />
              <span>My Store</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors relative">
              <ShoppingCart size={16} />
              <span>Cart ({cart.length})</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Product Discovery AI"
            description="I help you find profitable products and optimize your reselling strategy"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products, suppliers, or categories..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-3">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="commission">Highest Commission</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.trending && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    🔥 Trending
                  </span>
                )}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Heart size={16} className="text-gray-600" />
                </button>
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => copyUniqueLink(product)}
                    className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Copy size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors">
                    <Share2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Supplier */}
                <div className="flex items-center space-x-2 mb-2">
                  <Store size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">{product.supplier}</span>
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500" fill="currentColor" />
                    <span className="text-xs text-gray-600">{product.supplierRating}</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Rating and Sales */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>
                  <span className="text-xs text-gray-600">{product.sales} sold</span>
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-gray-600">Cost: ${product.cost}</span>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Your Commission:</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">${product.commissionAmount}</span>
                        <span className="text-xs text-green-700 block">({product.commission}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory and Shipping */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Package size={12} />
                    <span>{product.inventory} in stock</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck size={12} />
                    <span>{product.shipping}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add to Cart
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => copyUniqueLink(product)}
                      className="flex items-center justify-center space-x-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Copy size={14} />
                      <span>Get Link</span>
                    </button>
                    <button className="flex items-center justify-center space-x-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <ExternalLink size={14} />
                      <span>Visit Store</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div>
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Supplier Info */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Store size={20} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedProduct.supplier}</p>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500" fill="currentColor" />
                          <span className="text-sm text-gray-600">{selectedProduct.supplierRating} rating</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.features.map((feature: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-3">Profit Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Selling Price:</span>
                          <span className="font-medium">${selectedProduct.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Your Cost:</span>
                          <span className="font-medium">${selectedProduct.cost}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-200 pt-2">
                          <span className="font-medium text-green-800">Your Commission ({selectedProduct.commission}%):</span>
                          <span className="font-bold text-green-600">${selectedProduct.commissionAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Unique Link */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Your Unique Tracking Link</h3>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                          {generateUniqueLink(selectedProduct)}
                        </code>
                        <button 
                          onClick={() => copyUniqueLink(selectedProduct)}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        All sales through this link will be tracked to your account for commission
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                      <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Visit Supplier Store
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResellersMarketplace;