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
  Globe,
  QrCode,
  Download,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  CheckCircle,
  Zap,
  UserPlus,
  ArrowRight,
  X,
  CreditCard,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AgentSlot from '../components/AgentSlot';

const ResellersMarketplace = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showLinkGenerator, setShowLinkGenerator] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState<any>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string>('');

  // Check if user is a reseller (can generate referral links)
  const isReseller = user?.role === 'reseller';
  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';

  // Mock reseller ID - in real app this would come from auth context
  const resellerId = user?.role === 'reseller' ? 'sarah-j-2024' : null;
  const resellerName = user?.name || 'User';

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
      trending: true,
      slug: 'wireless-bluetooth-headphones'
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
      trending: false,
      slug: 'smart-fitness-tracker'
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
      trending: true,
      slug: 'portable-phone-charger'
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
      trending: false,
      slug: 'organic-skincare-set'
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

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Generate unique tracking link for reseller
  const generateTrackingLink = (product: any, campaign?: string) => {
    if (!resellerId) return `https://${product.supplierUrl}/product/${product.slug}`;
    
    const baseUrl = `https://${product.supplierUrl}`;
    const productPath = `/product/${product.slug}`;
    const trackingParams = new URLSearchParams({
      ref: resellerId,
      utm_source: 'droppay',
      utm_medium: 'referral',
      utm_campaign: campaign || 'general',
      utm_content: product.id.toString()
    });
    
    return `${baseUrl}${productPath}?${trackingParams.toString()}`;
  };

  // Generate short link for easier sharing
  const generateShortLink = (product: any, campaign?: string) => {
    if (!resellerId) return `https://droppay.link/product-${product.id}`;
    const trackingId = `${resellerId}-${product.id}-${Date.now().toString(36)}`;
    return `https://droppay.link/${trackingId}`;
  };

  const copyToClipboard = async (text: string, type: string = 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToSocialMedia = (product: any, platform: string) => {
    const trackingLink = generateTrackingLink(product, platform);
    const message = `Check out this amazing ${product.name} - ${product.description.substring(0, 100)}... Get yours now!`;
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackingLink)}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(trackingLink)}&text=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trackingLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + trackingLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(trackingLink)}&text=${encodeURIComponent(message)}`,
      email: `mailto:?subject=${encodeURIComponent(`Check out ${product.name}`)}&body=${encodeURIComponent(message + '\n\n' + trackingLink)}`
    };

    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    }
  };

  const generateQRCode = (product: any) => {
    const trackingLink = generateTrackingLink(product, 'qr-code');
    // In a real app, you'd use a QR code library like qrcode.js
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackingLink)}`;
  };

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-500' },
    { id: 'telegram', name: 'Telegram', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-gray-600' }
  ];

  // Get page title and description based on user role
  const getPageInfo = () => {
    if (isReseller) {
      return {
        title: 'Resellers Marketplace',
        description: 'Discover products to resell and earn commissions with unique tracking links',
        agentName: 'Product Discovery AI',
        agentDescription: 'I help you find profitable products and generate optimized referral links for maximum conversions'
      };
    } else if (isClient) {
      return {
        title: 'Product Marketplace',
        description: 'Discover and purchase premium products from verified suppliers',
        agentName: 'Shopping Assistant AI',
        agentDescription: 'I help you find the best products, compare prices, and track your orders'
      };
    } else {
      return {
        title: 'Marketplace',
        description: 'Browse products and suppliers on our platform',
        agentName: 'Marketplace AI',
        agentDescription: 'I help you navigate our marketplace and find what you need'
      };
    }
  };

  const pageInfo = getPageInfo();

  const handleCheckout = () => {
    // Simulate checkout process
    alert(`Order placed successfully! Total: $${getCartTotal().toFixed(2)}\n\nYou will receive an email confirmation shortly.`);
    setCart([]);
    setShowCart(false);
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageInfo.title}</h1>
            <p className="text-gray-600">{pageInfo.description}</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {isReseller && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Store size={16} />
                <span>My Store</span>
              </button>
            )}
            <button 
              onClick={() => setShowCart(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <ShoppingCart size={16} />
              <span>Cart ({getCartItemCount()})</span>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName={pageInfo.agentName}
            description={pageInfo.agentDescription}
          />
        </div>

        {/* Role-specific Banner */}
        {isReseller && (
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">$2,847</div>
                <div className="text-green-100 text-sm">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">156</div>
                <div className="text-green-100 text-sm">Products Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">89</div>
                <div className="text-green-100 text-sm">Successful Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">3.2%</div>
                <div className="text-green-100 text-sm">Conversion Rate</div>
              </div>
            </div>
          </div>
        )}

        {isClient && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Welcome to Our Marketplace</h2>
                <p className="text-purple-100 mb-4">Discover premium products from verified suppliers worldwide</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Package size={16} />
                    <span>1,200+ Products</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck size={16} />
                    <span>Free shipping on orders $50+</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link 
                  to="/orders"
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Track Orders
                </Link>
                <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                  View Wishlist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade to Reseller CTA for Clients */}
        {isClient && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Want to Earn Money?</h3>
                  <p className="text-yellow-700">Become a reseller and earn commissions by sharing products with others!</p>
                </div>
              </div>
              <Link
                to="/register/reseller"
                className="flex items-center space-x-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <UserPlus size={16} />
                <span>Become Reseller</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

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
                {isReseller && <option value="commission">Highest Commission</option>}
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
                    title="View Details"
                  >
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  {isReseller && (
                    <>
                      <button 
                        onClick={() => setShowLinkGenerator(product)}
                        className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                        title="Generate Link"
                      >
                        <LinkIcon size={16} className="text-gray-600" />
                      </button>
                      <button 
                        onClick={() => setShowShareModal(product)}
                        className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                        title="Share Product"
                      >
                        <Share2 size={16} className="text-gray-600" />
                      </button>
                    </>
                  )}
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
                    {isReseller && (
                      <span className="text-sm text-gray-600">Cost: ${product.cost}</span>
                    )}
                  </div>
                  
                  {isReseller && (
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">Your Commission:</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">${product.commissionAmount}</span>
                          <span className="text-xs text-green-700 block">({product.commission}%)</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                  {isReseller ? (
                    <>
                      <button 
                        onClick={() => setShowLinkGenerator(product)}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <LinkIcon size={16} />
                        <span>Get Referral Link</span>
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => addToCart(product)}
                          className="flex items-center justify-center space-x-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Plus size={14} />
                          <span>Cart</span>
                        </button>
                        <button 
                          onClick={() => setShowShareModal(product)}
                          className="flex items-center justify-center space-x-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Share2 size={14} />
                          <span>Share</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center space-x-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          <Heart size={14} />
                          <span>Wishlist</span>
                        </button>
                        <button 
                          onClick={() => window.open(`https://${product.supplierUrl}`, '_blank')}
                          className="flex items-center justify-center space-x-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <ExternalLink size={14} />
                          <span>Visit Store</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">Your cart is empty</p>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.supplier}</p>
                            <p className="text-lg font-bold text-gray-900">${item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-gray-900">${getCartTotal().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setShowCart(false)}
                          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Continue Shopping
                        </button>
                        <button 
                          onClick={() => {
                            setShowCart(false);
                            setShowCheckout(true);
                          }}
                          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <CreditCard size={16} />
                          <span>Checkout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Credit/Debit Card</option>
                      <option>PayPal</option>
                      <option>Apple Pay</option>
                      <option>Google Pay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-gray-900">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reseller-only Modals */}
        {isReseller && (
          <>
            {/* Link Generator Modal */}
            {showLinkGenerator && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Generate Referral Link</h2>
                        <p className="text-gray-600">{showLinkGenerator.name}</p>
                      </div>
                      <button 
                        onClick={() => setShowLinkGenerator(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Campaign Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Campaign Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., summer-sale, instagram-promo"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Help track which campaigns perform best
                        </p>
                      </div>

                      {/* Generated Links */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Tracking Link
                          </label>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 bg-gray-50 px-3 py-2 rounded border text-sm break-all">
                              {generateTrackingLink(showLinkGenerator)}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(generateTrackingLink(showLinkGenerator))}
                              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              {copiedLink === generateTrackingLink(showLinkGenerator) ? (
                                <CheckCircle size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short Link (Easier to Share)
                          </label>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 bg-gray-50 px-3 py-2 rounded border text-sm">
                              {generateShortLink(showLinkGenerator)}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(generateShortLink(showLinkGenerator))}
                              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              {copiedLink === generateShortLink(showLinkGenerator) ? (
                                <CheckCircle size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          QR Code for Easy Sharing
                        </label>
                        <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                          <img 
                            src={generateQRCode(showLinkGenerator)} 
                            alt="QR Code"
                            className="w-32 h-32"
                          />
                        </div>
                        <div className="mt-2">
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = generateQRCode(showLinkGenerator);
                              link.download = `${showLinkGenerator.slug}-qr-code.png`;
                              link.click();
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Download QR Code
                          </button>
                        </div>
                      </div>

                      {/* Link Analytics Preview */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">📊 Link Analytics</h3>
                        <p className="text-blue-700 text-sm">
                          Track clicks, conversions, and earnings for this specific link in your dashboard.
                          All sales through this link will be automatically attributed to you.
                        </p>
                      </div>

                      {/* Quick Share Buttons */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Quick Share
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {socialPlatforms.slice(0, 6).map((platform) => {
                            const Icon = platform.icon;
                            return (
                              <button
                                key={platform.id}
                                onClick={() => shareToSocialMedia(showLinkGenerator, platform.id)}
                                className={`flex items-center justify-center space-x-2 py-2 px-3 ${platform.color} text-white rounded-lg hover:opacity-90 transition-opacity text-sm`}
                              >
                                <Icon size={16} />
                                <span>{platform.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-lg w-full">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Share Product</h2>
                        <p className="text-gray-600">{showShareModal.name}</p>
                      </div>
                      <button 
                        onClick={() => setShowShareModal(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {socialPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <button
                            key={platform.id}
                            onClick={() => {
                              shareToSocialMedia(showShareModal, platform.id);
                              setShowShareModal(null);
                            }}
                            className={`flex items-center space-x-3 p-4 ${platform.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                          >
                            <Icon size={20} />
                            <span className="font-medium">{platform.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowShareModal(null);
                          setShowLinkGenerator(showShareModal);
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Zap size={16} />
                        <span>Advanced Link Options</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

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
                    <X size={24} />
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
                    {isReseller ? (
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
                    ) : (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-3">Pricing</h3>
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl font-bold text-blue-600">${selectedProduct.price}</span>
                          <div className="text-sm text-blue-700">
                            <p>{selectedProduct.shipping}</p>
                            <p>{selectedProduct.inventory} in stock</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                      {isReseller ? (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedProduct(null);
                              setShowLinkGenerator(selectedProduct);
                            }}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Get Referral Link
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedProduct(null);
                              setShowShareModal(selectedProduct);
                            }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Share Now
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              addToCart(selectedProduct);
                              setSelectedProduct(null);
                            }}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Add to Cart
                          </button>
                          <button 
                            onClick={() => window.open(`https://${selectedProduct.supplierUrl}`, '_blank')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Visit Store
                          </button>
                        </>
                      )}
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