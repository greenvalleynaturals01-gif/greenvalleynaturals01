'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShopContext } from '@/context/ShopContext';
import { NotificationContext } from '@/context/NotificationContext';
import AuthPrompt from '@/components/AuthPrompt';
import CartPreview from '@/components/CartPreview';
import { sampleProducts } from '@/assets/sampleProducts';
import { Heart, Trash2, ShoppingCart, X, ArrowLeft, ChevronRight } from 'lucide-react';

const WishlistPage = () => {
  const router = useRouter();
  const { products, currency, token } = useContext(ShopContext);
  const { success } = useContext(NotificationContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  if (!token) {
    return <AuthPrompt title="Save Your Favorites" subtitle="Sign in to create and manage your wishlist" />;
  }

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem('wishlist');
        const items = saved ? JSON.parse(saved) : [];
        setWishlistItems(items);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
      setLoading(false);
    };

    loadWishlist();

    // Listen for storage changes
    window.addEventListener('storage', loadWishlist);
    window.addEventListener('focus', loadWishlist);

    return () => {
      window.removeEventListener('storage', loadWishlist);
      window.removeEventListener('focus', loadWishlist);
    };
  }, []);

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter(id => id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    success('Item removed from wishlist');
  };

  // Get product details
  const getProduct = (productId) => {
    if (products && products.length > 0) {
      const found = products.find(p => String(p.id || p._id) === String(productId));
      if (found) return found;
    }
    return sampleProducts.find(p => String(p.id) === String(productId));
  };

  const wishlistProducts = wishlistItems.map(id => getProduct(id)).filter(p => p !== undefined);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FAFAF8' }} className='min-h-screen flex items-center justify-center'>
        <div className='text-lg font-semibold text-gray-700'>Loading wishlist...</div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div style={{ backgroundColor: '#FAFAF8' }} className='min-h-screen py-12'>
        <div className='max-w-6xl mx-auto px-4'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 mb-8 font-semibold transition'
            style={{ color: '#2F6B3F' }}
          >
            <ArrowLeft size={20} /> Back
          </button>

          <div className='text-center py-12'>
            <Heart size={64} className='mx-auto mb-6' style={{ color: '#CCC' }} />
            <h1 className='text-3xl font-bold mb-2' style={{ color: '#1A1A1A' }}>
              Your Wishlist is Empty
            </h1>
            <p className='text-base mb-8' style={{ color: '#555' }}>
              Start adding your favorite items to your wishlist
            </p>
            <button
              onClick={() => router.push('/collection')}
              className='px-8 py-3 rounded-lg font-bold text-white transition'
              style={{ backgroundColor: '#2F6B3F' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className='min-h-screen py-12'>
      <div className='max-w-6xl mx-auto px-4'>
        
        <div className='flex items-center justify-between mb-8'>
          <div>
            <button
              onClick={() => router.back()}
              className='flex items-center gap-2 mb-4 font-semibold transition'
              style={{ color: '#2F6B3F' }}
            >
              <ArrowLeft size={20} /> Back
            </button>
            <h1 className='text-4xl font-bold mb-2' style={{ color: '#1A1A1A' }}>
              My Wishlist
            </h1>
            <p className='text-base' style={{ color: '#555' }}>
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {wishlistProducts.map((product) => {
            const productId = product.id || product._id;
            
            const getProductPrice = () => {
              if (product.variants && product.variants.length > 0) {
                return Number(product.variants[0].sellingPrice) || 0;
              }
              return 0;
            };
            
            const getOriginalPrice = () => {
              if (product.variants && product.variants.length > 0) {
                return product.variants[0].originalPrice || null;
              }
              return product.originalPrice || null;
            };
            
            const currentPrice = getProductPrice();
            const originalPrice = getOriginalPrice();
            const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
            
            const productImage = (() => {
              if (product.image) return product.image;
              if (Array.isArray(product.images)) {
                return typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url;
              }
              return 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
            })();
            
            return (
              <div key={productId} className='bg-white rounded-lg border overflow-hidden transition hover:shadow-lg cursor-pointer' style={{ borderColor: '#E6E1D8' }} onClick={() => router.push(`/product/${productId}`)}>
                
                <div className='relative bg-gray-100 overflow-hidden' style={{ height: '240px' }}>
                  <img
                    src={productImage}
                    alt={product.name}
                    className='w-full h-full object-cover transition hover:scale-110'
                    onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                  />
                  
                  {discount > 0 && (
                    <div className='absolute top-3 left-3 px-3 py-1 rounded-full font-bold text-white text-sm' style={{ backgroundColor: '#D6524A' }}>
                      -{discount}%
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(productId);
                    }}
                    className='absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition'
                    style={{ backgroundColor: '#FFF', color: '#D6524A' }}
                  >
                    <Heart size={20} fill='#D6524A' />
                  </button>

                  {product.variants?.every(v => v.stockQty === 0) && (
                    <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center'>
                      <span className='text-white font-bold'>Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className='p-4'>
                  <p className='text-xs font-semibold mb-2' style={{ color: '#777' }}>
                    {product.categories && product.categories.length > 0 ? product.categories[0] : 'Uncategorized'}
                  </p>
                  
                  <h3 className='text-sm font-bold mb-3 line-clamp-2' style={{ color: '#1A1A1A', minHeight: '40px' }}>
                    {product.name}
                  </h3>

                  <div className='flex items-center gap-2 mb-3'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className='text-xs' style={{ color: i < Math.floor(product.rating) ? '#FFB800' : '#E6E1D8' }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className='text-xs' style={{ color: '#777' }}>
                      ({product.reviews})
                    </span>
                  </div>

                  <div className='mb-4'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-lg font-bold' style={{ color: '#2F6B3F' }}>
                        {currency}{currentPrice}
                      </span>
                      {originalPrice && originalPrice > currentPrice && (
                        <span className='text-sm line-through' style={{ color: '#999' }}>
                          {currency}{originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/product/${productId}`);
                      }}
                      disabled={!product.variants || product.variants.every(v => v.stockQty === 0)}
                      className='w-full py-2 rounded-lg font-bold text-sm text-white transition disabled:opacity-50'
                      style={{ backgroundColor: '#2F6B3F' }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/product/${productId}`);
                      }}
                      className='w-full py-2 rounded-lg font-bold text-sm border-2 transition flex items-center justify-center gap-2'
                      style={{ borderColor: '#2F6B3F', color: '#2F6B3F', backgroundColor: '#FFF' }}
                    >
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CartPreview />
    </div>
  );
};

export default WishlistPage;
