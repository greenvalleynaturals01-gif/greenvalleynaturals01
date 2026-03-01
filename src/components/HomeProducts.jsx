'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { NotificationContext } from '../context/NotificationContext';
import { sampleProducts } from '../assets/sampleProducts';

export function HomeProducts() {
  const router = useRouter();
  const { products, addToCart } = useContext(ShopContext);
  const { success } = useContext(NotificationContext);
  
  const allProducts = products?.length > 0 ? products.slice(0, 8) : [];

  const handleAddToCart = (e, productId, product) => {
    e.stopPropagation();
    const variantWeight = (product.variants && product.variants.length > 0) ? product.variants[0].weight : null;
    addToCart(productId, 1, variantWeight);
  };

  const getProductPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return Number(product.variants[0].sellingPrice) || 0;
    }
    return 0;
  };

  const getOriginalPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].originalPrice || null;
    }
    return product.originalPrice || null;
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
  };

  return (
    <section className="py-10 sm:py-14 lg:py-16" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h3 className="text-3xl font-semibold mb-2" style={{ color: '#5B4636' }}>
              Pure Pantry Staples
            </h3>
            <p style={{ color: '#6B6B6B' }}>Rice, Atta, Maize, Pulses and everyday essentials</p>
          </div>
          <button 
            onClick={() => router.push('/collection')}
            className="text-sm hover:opacity-70 transition-opacity" 
            style={{ color: '#2F6B3F' }}
          >
            View All Products →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {allProducts.map((product) => {
            const productId = product.id || product._id;
            const imageUrl = typeof product.image === 'string' 
              ? product.image 
              : product.images?.[0]?.url || product.images?.[0] || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
            
            return (
              <div
                key={productId}
                onClick={() => router.push(`/product/${productId}`)}
                className="group rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: '#F8F6F2', border: '1px solid #E6E1D8' }}
              >
                <div className="relative aspect-[5/4] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                  <img 
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                  />
                  {product.tag && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#2F6B3F', color: '#FFFFFF' }}>
                      {product.tag}
                    </div>
                  )}
                  {product.variants && product.variants[0] && product.variants[0].originalPrice && product.variants[0].sellingPrice < product.variants[0].originalPrice && (
                    <div
                      className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-white"
                      style={{ backgroundColor: '#D6524A' }}
                    >
                      -{Math.round(((product.variants[0].originalPrice - product.variants[0].sellingPrice) / product.variants[0].originalPrice) * 100)}%
                    </div>
                  )}
                  <button 
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" 
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <Heart className="w-5 h-5" style={{ color: '#5B4636' }} />
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  {product.categories && product.categories.length > 0 && (
                    <span className="inline-block text-xs font-medium mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#F5F5F5', color: '#666' }}>
                      {product.categories[0]}
                    </span>
                  )}

                  <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 leading-snug tracking-tight" style={{ color: '#1A1A1A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </h4>

                  {(() => {
                    const variant = product.variants?.[0];
                    const weight = variant?.weight || '';
                    return weight ? (
                      <p className="text-xs mb-0.5" style={{ color: '#999' }}>
                        {weight}
                      </p>
                    ) : null;
                  })()}

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

                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const variant = product.variants?.[0];
                        const sp = Number(variant?.sellingPrice) || 0;
                        const originalPrice = variant?.originalPrice ? Number(variant.originalPrice) : sp;
                        const discount = originalPrice > sp && sp > 0 ? Math.round(((originalPrice - sp) / originalPrice) * 100) : 0;
                        
                        return (
                          <>
                            <div className="flex items-baseline gap-2">
                              {originalPrice > sp && (
                                <span className="text-sm line-through" style={{ color: '#999' }}>
                                  ₹{originalPrice}
                                </span>
                              )}
                              <span className="text-xl font-semibold" style={{ color: '#2F6B3F' }}>
                                ₹{sp}
                              </span>
                              {discount > 0 && (
                                <span className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded" style={{ backgroundColor: '#D6524A', color: '#FFF' }}>
                                  Save {discount}%
                                </span>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleAddToCart(e, productId, product)}
                    className="w-full py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm" 
                    style={{ backgroundColor: '#2F6B3F', color: '#FFFFFF' }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeProducts;
