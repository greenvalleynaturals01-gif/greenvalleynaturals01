'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { ShopContext } from '@/context/ShopContext';
import { NotificationContext } from '@/context/NotificationContext';
import CartPreview from '@/components/CartPreview';
import ShareProduct from '@/components/ShareProduct';

const CollectionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, addToCart } = useContext(ShopContext);
  const { success } = useContext(NotificationContext);
  
  // Use admin products only
  const allProducts = (products && products.length > 0) ? products : [];
  
  // Helper function to get product price (first variant's selling price)
  const getProductPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return Number(product.variants[0].sellingPrice) || 0;
    }
    return 0;
  };

  // Helper function to check if product is out of stock (all variants have 0 stock)
  const isProductOutOfStock = (product) => {
    if (!product.variants || product.variants.length === 0) return false;
    return product.variants.every(variant => (variant.stockQty || 0) === 0);
  };

  // Helper function to get product original price
  const getOriginalPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].originalPrice || null;
    }
    return product.originalPrice || null;
  };
  
  // Calculate max price dynamically from all available products
  const maxPrice = Math.max(...allProducts.map(p => getProductPrice(p)), 1000);
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const [shareModal, setShareModal] = useState({ open: false, product: null, productId: null });

  const handleWishlistToggle = (productId, productName) => {
    try {
      let updated;
      if (wishlist.includes(productId)) {
        updated = wishlist.filter(id => id !== productId);
        success('Item removed from wishlist');
      } else {
        updated = [...wishlist, productId];
        success('Item added to wishlist');
      }
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleShare = (product, productId) => {
    setShareModal({ open: true, product, productId });
  };

  // Update price range when products change
  useEffect(() => {
    // Removed - no longer using price range
  }, [products]);

  // Read category from query parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Make categories dynamic from all available products - flatten array of category arrays
  const categories = ['All', ...new Set(allProducts.flatMap(p => p.categories || []))];

  // Make tags dynamic from all available products
  const tags = ['All', ...new Set(allProducts.flatMap(p => p.tags || []))];

  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === 'All' || (product.categories && product.categories.includes(selectedCategory));
    const tagMatch = selectedTag === 'All' || (product.tags && product.tags.includes(selectedTag));
    const searchMatch = searchQuery === '' || (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && tagMatch && searchMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'price-low') return getProductPrice(a) - getProductPrice(b);
    if (sortBy === 'price-high') return getProductPrice(b) - getProductPrice(a);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      {/* Professional Header - Amazon/Flipkart Style */}
      <section className="py-4 px-4 sm:px-6 md:px-10 border-b" style={{ borderColor: '#E6E1D8', backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl">
          {/* Top Row - Heading */}
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-semibold" style={{ color: '#2F6B3F' }}>
              Collections
            </h1>
          </div>

          {/* Bottom Row - Search & Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search Bar - Takes majority space */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#777' }} />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-sm md:text-base"
                style={{ border: '1px solid #E6E1D8', backgroundColor: '#F8F6F2' }}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm md:text-base font-medium"
                style={{ border: '1px solid #E6E1D8', color: '#5B4636', backgroundColor: '#FFFFFF' }}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price ↓</option>
                <option value="price-high">Price ↑</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Results Counter */}
            <div className="w-full sm:w-auto text-center sm:text-right">
              <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                {sortedProducts.length} items
              </span>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="mt-4 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 text-sm"
              style={{ backgroundColor: '#2F6B3F', color: '#FFFFFF' }}
            >
              {showFilters ? '✕ Hide Filters' : '☰ Show Filters'}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
              <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E6E1D8' }}>
                {/* Close button for mobile */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                  <h3 className="text-lg font-semibold" style={{ color: '#5B4636' }}>Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-4" style={{ color: '#5B4636' }}>Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="w-full text-left px-3 py-2 rounded-lg transition-all duration-300"
                        style={{
                          backgroundColor: selectedCategory === category ? '#2F6B3F' : 'transparent',
                          color: selectedCategory === category ? '#FFFFFF' : '#6B6B6B'
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                {tags.length > 1 && (
                  <div className="mb-8">
                    <h4 className="font-semibold mb-4" style={{ color: '#5B4636' }}>Tags</h4>
                    <div className="space-y-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="w-full text-left px-3 py-2 rounded-lg transition-all duration-300"
                          style={{
                            backgroundColor: selectedTag === tag ? '#2F6B3F' : 'transparent',
                            color: selectedTag === tag ? '#FFFFFF' : '#6B6B6B'
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTag('All');
                    setSearchQuery('');
                  }}
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#F8F6F2', color: '#2F6B3F' }}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {sortedProducts.map((product) => {
                    // Handle both id and _id fields
                    const productId = product.id || product._id;
                    // Normalize image - handle both string and object formats
                    const productImage = (() => {
                      if (product.image) return product.image;
                      if (Array.isArray(product.images) && product.images.length > 0) {
                        const firstImg = typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url;
                        if (firstImg) return firstImg;
                      }
                      return 'https://via.placeholder.com/400?text=No+Image';
                    })();
                    
                    return (
                    <div
                      key={productId}
                      onClick={() => router.push(`/product/${productId}`)}
                      className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                      style={{ backgroundColor: '#F8F6F2', border: '1px solid #E6E1D8' }}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-[5/4] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          style={{
                            filter: isProductOutOfStock(product) ? 'grayscale(100%)' : 'grayscale(0%)',
                            opacity: isProductOutOfStock(product) ? 0.85 : 1
                          }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=No+Image'}
                        />
                        
                        {/* Out of Stock Badge */}
                        {isProductOutOfStock(product) && (
                          <div
                            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: '#666' }}
                          >
                            Out of Stock
                          </div>
                        )}
                        
                        {/* Discount Badge */}
                        {!isProductOutOfStock(product) && product.variants && product.variants[0] && product.variants[0].originalPrice && product.variants[0].sellingPrice < product.variants[0].originalPrice && (
                          <div
                            className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-white"
                            style={{ backgroundColor: '#D6524A' }}
                          >
                            -{Math.round(((product.variants[0].originalPrice - product.variants[0].sellingPrice) / product.variants[0].originalPrice) * 100)}%
                          </div>
                        )}
                        {/* Wishlist & Share Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWishlistToggle(productId, product.name);
                            }}
                            className="p-2 rounded-full"
                            style={{ backgroundColor: '#FFFFFF' }}
                          >
                            <Heart
                              className="w-5 h-5"
                              style={{ 
                                color: wishlist.includes(productId) ? '#D6524A' : '#5B4636',
                                fill: wishlist.includes(productId) ? '#D6524A' : 'none'
                              }}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(product, productId);
                            }}
                            className="p-2 rounded-full"
                            style={{ backgroundColor: '#FFFFFF' }}
                            title="Share product"
                          >
                            <Share2 className="w-5 h-5" style={{ color: '#2F6B3F' }} />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 sm:p-4">
                        {/* Category Badge */}
                        {product.categories && product.categories.length > 0 && (
                          <span className="inline-block text-xs font-medium mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#F5F5F5', color: '#666' }}>
                            {product.categories[0]}
                          </span>
                        )}

                        {/* Name - Large & Bold */}
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 line-clamp-2 leading-snug tracking-tight" style={{ color: '#1A1A1A' }}>
                          {product.name}
                        </h4>

                        {/* Weight */}
                        {(() => {
                          const variant = product.variants?.[0];
                          const weight = variant?.weight || '';
                          return weight ? (
                            <p className="text-xs mb-0.5" style={{ color: '#999' }}>
                              {weight}
                            </p>
                          ) : null;
                        })()}

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex text-sm" style={{ color: '#2F6B3F' }}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                            ))}
                          </div>
                          <span className="text-xs" style={{ color: '#999' }}>
                            ({product.reviews || 0})
                          </span>
                        </div>

                        {/* Price & Discount */}
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          {(() => {
                            const variant = product.variants?.[0];
                            const originalPrice = variant?.originalPrice ? Number(variant.originalPrice) : Number(variant?.sellingPrice) || 0;
                            const sp = Number(variant?.sellingPrice) || 0;
                            const discount = originalPrice > sp && sp > 0 ? Math.round(((originalPrice - sp) / originalPrice) * 100) : 0;
                            
                            return (
                              <>
                                {originalPrice > sp && (
                                  <span className="text-sm line-through" style={{ color: '#999' }}>
                                    ₹{originalPrice}
                                  </span>
                                )}
                                <span className="text-xl font-semibold" style={{ color: '#2F6B3F' }}>
                                  ₹{sp}
                                </span>
                                {discount > 0 && (
                                  <span className="text-[10px] sm:text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded" style={{ backgroundColor: '#E8F5E9', color: '#2F6B3F' }}>
                                    Save {discount}%
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => {
                            if (isProductOutOfStock(product)) return;
                            const variantWeight = (product.variants && product.variants.length > 0) ? product.variants[0].weight : null;
                            addToCart(productId, 1, variantWeight);
                          }}
                          disabled={isProductOutOfStock(product)}
                          className="w-full py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: isProductOutOfStock(product) ? '#CCCCCC' : '#2F6B3F',
                            color: '#FFFFFF',
                            cursor: isProductOutOfStock(product) ? 'not-allowed' : 'pointer',
                            opacity: isProductOutOfStock(product) ? 0.6 : 1,
                            filter: isProductOutOfStock(product) ? 'grayscale(100%)' : 'grayscale(0%)'
                          }}
                        >
                          {!isProductOutOfStock(product) && <ShoppingCart className="w-4 h-4" />}
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p style={{ color: '#6B6B6B' }} className="text-lg">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner - Minimal */}
      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-10 border-t" style={{ borderColor: '#E6E1D8' }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <div className="text-sm md:text-base font-semibold" style={{ color: '#2F6B3F' }}>100% Organic</div>
              <p className="text-xs" style={{ color: '#999999' }}>Certified</p>
            </div>
            <div>
              <div className="text-sm md:text-base font-semibold" style={{ color: '#2F6B3F' }}>Free Delivery</div>
              <p className="text-xs" style={{ color: '#999999' }}>Above ₹499</p>
            </div>
            <div>
              <div className="text-sm md:text-base font-semibold" style={{ color: '#2F6B3F' }}>Farm Fresh</div>
              <p className="text-xs" style={{ color: '#999999' }}>Daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Preview Component */}
      <CartPreview />

      {/* Share Modal - Render globally using isOpen and onClose props */}
      {shareModal.open && (
        <ShareProduct 
          product={shareModal.product} 
          productId={shareModal.productId}
          isOpen={true}
          onClose={() => setShareModal({ open: false, product: null, productId: null })}
        />
      )}
    </div>
  );
};

export default CollectionPage;
