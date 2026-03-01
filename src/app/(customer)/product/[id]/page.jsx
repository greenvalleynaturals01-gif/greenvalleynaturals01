'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { ShopContext } from '@/context/ShopContext';
import { NotificationContext } from '@/context/NotificationContext';
import ReviewSection from '@/components/ReviewSection';
import RelatedProducts from '@/components/RelatedProducts';
import CartPreview from '@/components/CartPreview';
import ShareProduct from '@/components/ShareProduct';
import { sampleProducts } from '@/assets/sampleProducts';
import { Heart, Minus, Plus, Truck, Shield, RotateCcw, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const { products, addToCart, backendUrl, token, user, cartItems, updateQuantity } = useContext(ShopContext);
  const { success } = useContext(NotificationContext);
  
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Get all products (admin or sample)
  const allProducts = (products && products.length > 0) ? products : sampleProducts;
  const product = allProducts.find(p => {
    const pId = String(p.id || p._id);
    const paramId = String(productId);
    return pId === paramId;
  });

  // Initialize selected variant (first variant)
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Calculate quantity already in cart for this variant
  const getCartQuantity = () => {
    if (!product || !selectedVariant) return 0;
    const productId = product.id || product._id;
    const cartItem = cartItems[productId];
    
    if (!cartItem) return 0;
    
    if (typeof cartItem === 'object') {
      const normalizedWeight = String(selectedVariant.weight).trim();
      return Number(cartItem[normalizedWeight]) || 0;
    }
    return 0;
  };

  const cartQuantity = getCartQuantity();

  // Load wishlist state on mount
  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (product) {
        const productId = product.id || product._id;
        if (wishlist.includes(productId)) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, [product]);

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    try {
      const productId = product.id || product._id;
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (isWishlisted) {
        const updated = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        success('Item removed from wishlist');
      } else {
        if (!wishlist.includes(productId)) {
          wishlist.push(productId);
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        success('Item added to wishlist');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  }

  if (!product) {
    return (
      <div className="py-24 px-4 text-center" style={{ backgroundColor: '#FFFFFF' }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#2F6B3F' }}>Product Not Found</h1>
        <p style={{ color: '#555' }} className="mb-8">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/collection')}
          className="px-8 py-3 rounded-lg font-semibold"
          style={{ backgroundColor: '#2F6B3F', color: '#FFFFFF' }}
        >
          Back to Collections
        </button>
      </div>
    );
  }

  // Handle both id and _id fields
  const finalProductId = product.id || product._id;

  const images = (() => {
    const imgs = product.images || (product.image ? [product.image] : []);
    // Normalize: handle both string arrays and object arrays with url property
    const normalized = imgs
      .map(img => typeof img === 'string' ? img : img?.url)
      .filter(img => img); // Remove undefined/null values
    return normalized.length > 0 ? normalized : ['https://via.placeholder.com/400?text=No+Image'];
  })();
  
  // Calculate discount from selected variant (Original Price - Selling Price)
  const getDiscount = () => {
    if (selectedVariant?.sellingPrice && selectedVariant?.originalPrice) {
      const discountPercent = Math.round(((selectedVariant.originalPrice - selectedVariant.sellingPrice) / selectedVariant.originalPrice) * 100);
      return discountPercent > 0 ? discountPercent : 0;
    }
    return 0;
  };

  // Helper function to check if product is out of stock (all variants have 0 stock)
  const isProductOutOfStock = (product) => {
    if (!product.variants || product.variants.length === 0) return false;
    return product.variants.every(variant => (variant.stockQty || 0) === 0);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      {/* Breadcrumb */}
      <div className="py-5 px-4 md:px-8 border-b" style={{ borderColor: '#E6E1D8' }}>
        <div className="max-w-7xl mx-auto flex gap-2 text-sm" style={{ color: '#555' }}>
          <button onClick={() => router.push('/collection')} style={{ color: '#2F6B3F' }} className="hover:underline">
            Collections
          </button>
          <span>/</span>
          <button onClick={() => router.push('/collection')} style={{ color: '#2F6B3F' }} className="hover:underline">
            {product.categories && product.categories[0] ? product.categories[0] : 'Products'}
          </button>
          <span>/</span>
          <span>{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* LEFT: Image Gallery */}
            <div className=''>
              {/* Main Image with Navigation */}
              <div
                onClick={() => setShowImageModal(true)}
                className="relative w-full rounded-lg overflow-hidden flex items-center justify-center mb-4 group cursor-pointer hover:shadow-lg transition-shadow"
                style={{ backgroundColor: '#F8F6F2', border: '1px solid #E6E1D8', width: '100%', height: '450px' }}
              >
                <img
                  src={images[selectedImage] || product.image || 'https://via.placeholder.com/400?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                  }}
                  style={{
                    filter: isProductOutOfStock(product) ? 'grayscale(100%)' : 'grayscale(0%)',
                    opacity: isProductOutOfStock(product) ? 0.85 : 1
                  }}
                />
                
                {/* Out of Stock Badge */}
                {isProductOutOfStock(product) && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1.5 rounded text-sm font-bold text-white"
                    style={{ backgroundColor: '#666' }}
                  >
                    Out of Stock
                  </div>
                )}
                
                {/* Discount Badge */}
                {!isProductOutOfStock(product) && getDiscount() > 0 && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1.5 rounded text-sm font-bold"
                    style={{ backgroundColor: '#D6524A', color: '#FFF' }}
                  >
                    -{getDiscount()}%
                  </div>
                )}

                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx => Math.max(0, idx - 1));
                  }}
                  disabled={selectedImage === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                >
                  <ChevronLeft className="w-6 h-6" style={{ color: '#2F6B3F' }} />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx => Math.min(images.length - 1, idx + 1));
                  }}
                  disabled={selectedImage === images.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                >
                  <ChevronRight className="w-6 h-6" style={{ color: '#2F6B3F' }} />
                </button>

                {/* Image Counter */}
                <div
                  className="absolute bottom-4 left-4 px-3 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF' }}
                >
                  {selectedImage + 1} / {images.length}
                </div>

                {/* Click to expand hint */}
                <div
                  className="absolute bottom-4 right-4 px-3 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF' }}
                >
                  Click to expand
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className="rounded flex-shrink-0 overflow-hidden transition-all hover:shadow-md"
                    style={{
                      border: selectedImage === idx ? '3px solid #2F6B3F' : '1px solid #E6E1D8',
                      backgroundColor: '#F8F6F2',
                      opacity: selectedImage === idx ? 1 : 0.7,
                      width: '80px',
                      height: '80px'
                    }}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Details */}
            <div>
              {/* Category & Title */}
              <div className="mb-2">
                <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#2F6B3F' }}>
                  {product.categories && product.categories[0] ? product.categories[0] : 'Products'}
                </div>
                <h1 className="text-3xl font-bold mt-2 leading-tight" style={{ color: '#1A1A1A' }}>
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-3 pb-2 border-b" style={{ borderColor: '#E6E1D8' }}>
                <div className="flex gap-1" style={{ color: '#2F6B3F' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="font-semibold" style={{ color: '#2F6B3F' }}>{product.rating || 0}</span>
                <span style={{ color: '#555' }}>({product.reviews || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-3 border-b" style={{ borderColor: '#E6E1D8' }}>
                <div className="flex items-baseline gap-3">
                  {selectedVariant && (
                    <>
                      <span className="text-3xl sm:text-4xl font-bold" style={{ color: '#D6524A' }}>
                        ₹{selectedVariant.sellingPrice}
                      </span>
                      {selectedVariant.originalPrice && (
                        <>
                          <span className="text-sm sm:text-xl line-through" style={{ color: '#777' }}>
                            ₹{selectedVariant.originalPrice}
                          </span>
                          <span className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded font-bold" style={{ backgroundColor: '#F0EDE6', color: '#2F6B3F' }}>
                            Save {getDiscount()}%
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b" style={{ borderColor: '#E6E1D8', color: (selectedVariant?.stockQty || 0) > 0 ? '#2F6B3F' : '#D6524A' }}>
                <Check className="w-5 h-5" />
                <span className="font-semibold">
                  {(selectedVariant?.stockQty || 0) > 0 ? 'In Stock - Ships in 24 hours' : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-base mb-6 pb-6 border-b leading-relaxed" style={{ borderColor: '#E6E1D8', color: '#555' }}>
                {product.description}
              </p>

              {/* Weight/Size Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3" style={{ color: '#1A1A1A' }}>
                  Size / Weight
                </label>
                <div className="flex flex-wrap gap-4">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant.weight}
                      onClick={() => setSelectedVariant(variant)}
                      className="px-6 py-3.5 rounded border font-semibold transition text-base"
                      style={{
                        borderColor: selectedVariant?.weight === variant.weight ? '#2F6B3F' : '#E6E1D8',
                        backgroundColor: selectedVariant?.weight === variant.weight ? '#F0F8F4' : '#FFFFFF',
                        color: selectedVariant?.weight === variant.weight ? '#2F6B3F' : '#555'
                      }}
                    >
                      {variant.weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity in Cart - Only shown when item is in cart */}
              {cartQuantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3" style={{ color: '#1A1A1A' }}>
                    Quantity in Cart
                  </label>
                  <div className="flex items-center w-fit border rounded" style={{ borderColor: '#E6E1D8' }}>
                    <button
                      onClick={() => {
                        const newQty = cartQuantity - 1;
                        if (newQty > 0) {
                          updateQuantity(finalProductId, newQty, selectedVariant?.weight);
                        } else {
                          // Remove from cart when quantity reaches 0
                          updateQuantity(finalProductId, 0, selectedVariant?.weight);
                        }
                      }}
                      className="px-4 py-2.5 hover:bg-gray-100 transition"
                    >
                      <Minus className="w-5 h-5" style={{ color: '#555' }} />
                    </button>
                    <span className="px-5 py-2.5 font-semibold text-base" style={{ color: '#1A1A1A' }}>{cartQuantity}</span>
                    <button
                      onClick={() => {
                        updateQuantity(finalProductId, cartQuantity + 1, selectedVariant?.weight);
                      }}
                      className="px-4 py-2.5 hover:bg-gray-100 transition"
                    >
                      <Plus className="w-5 h-5" style={{ color: '#555' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* Stock Status Message */}
              {selectedVariant && (
                <div className="mb-6">
                  {selectedVariant.stockQty <= 0 ? (
                    <div className="px-4 py-3 rounded" style={{ backgroundColor: '#FFEBEE', color: '#D6524A' }}>
                      <span className="font-semibold text-sm">Out of Stock</span>
                    </div>
                  ) : selectedVariant.stockQty < 5 ? (
                    <div className="px-4 py-3 rounded" style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}>
                      <span className="font-semibold text-sm">Only {selectedVariant.stockQty} left</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => {
                    updateQuantity(finalProductId, 1, selectedVariant?.weight);
                  }}
                  disabled={(selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0}
                  className="flex-1 py-3 rounded-lg font-bold text-base transition"
                  style={{
                    backgroundColor: (selectedVariant?.stockQty || 0) <= 0 ? '#CCCCCC' : (cartQuantity > 0 ? '#CCCCCC' : '#2F6B3F'),
                    color: '#FFF',
                    filter: (selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0 ? 'grayscale(100%)' : 'none',
                    opacity: (selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0 ? 0.6 : 1,
                    cursor: (selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {cartQuantity > 0 ? '✓ In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => {
                    if (cartQuantity === 0) {
                      updateQuantity(finalProductId, 1, selectedVariant?.weight);
                      router.push('/cart');
                    }
                  }}
                  disabled={(selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0}
                  className="flex-1 py-3 rounded-lg font-bold text-base transition border-2"
                  style={{
                    borderColor: (selectedVariant?.stockQty || 0) <= 0 ? '#CCCCCC' : (cartQuantity > 0 ? '#CCCCCC' : '#2F6B3F'),
                    backgroundColor: (selectedVariant?.stockQty || 0) <= 0 ? '#F5F5F5' : (cartQuantity > 0 ? '#F5F5F5' : '#FFF'),
                    color: (selectedVariant?.stockQty || 0) <= 0 ? '#CCCCCC' : (cartQuantity > 0 ? '#CCCCCC' : '#2F6B3F'),
                    filter: (selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0 ? 'grayscale(100%)' : 'none',
                    opacity: (selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0 ? 0.6 : 1,
                    cursor: (selectedVariant?.stockQty || 0) <= 0 || cartQuantity > 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {cartQuantity > 0 ? '✓ In Cart' : 'Buy Now'}
                </button>
                <ShareProduct product={product} productId={finalProductId} />
                <button
                  onClick={handleWishlistToggle}
                  className="px-5 py-3 rounded-lg border transition"
                  style={{
                    borderColor: isWishlisted ? '#D6524A' : '#E6E1D8',
                    backgroundColor: isWishlisted ? '#FFE6E6' : '#FFF'
                  }}
                >
                  <Heart
                    className="w-6 h-6"
                    style={{ color: isWishlisted ? '#D6524A' : '#777' }}
                    fill={isWishlisted ? '#D6524A' : 'none'}
                  />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-4 pt-6 border-t" style={{ borderColor: '#E6E1D8' }}>
                <div className="flex gap-4">
                  <Truck className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#2F6B3F' }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#1A1A1A' }}>FREE DELIVERY</div>
                    <div className="text-sm" style={{ color: '#555' }}>On orders above ₹499</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#2F6B3F' }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#1A1A1A' }}>100% AUTHENTIC</div>
                    <div className="text-sm" style={{ color: '#555' }}>Certified organic products</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <RotateCcw className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#2F6B3F' }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#1A1A1A' }}>30-DAY RETURNS</div>
                    <div className="text-sm" style={{ color: '#555' }}>Easy return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8 px-6 md:px-8 border-t" style={{ borderColor: '#E6E1D8' }}>
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b mb-8" style={{ borderColor: '#E6E1D8' }}>
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="font-semibold pb-4 border-b-2 transition-colors text-sm"
                style={{
                  borderColor: activeTab === tab ? '#2F6B3F' : 'transparent',
                  color: activeTab === tab ? '#2F6B3F' : '#555'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div style={{ color: '#555' }} className="text-base leading-relaxed">
                <p className="mb-4">{product.description}</p>
                <h3 className="font-bold mb-3" style={{ color: '#1A1A1A' }}>Key Features:</h3>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>100% Organic Certified</li>
                  <li>No pesticides or chemicals</li>
                  <li>Fresh from certified farms</li>
                  <li>Carefully packaged</li>
                  <li>Premium quality guaranteed</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <table className="w-full text-sm">
                <tbody className="divide-y" style={{ borderColor: '#E6E1D8' }}>
                  <tr>
                    <td className="py-3 font-semibold w-1/3" style={{ color: '#1A1A1A' }}>Name</td>
                    <td className="py-3" style={{ color: '#555' }}>{product.name}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold" style={{ color: '#1A1A1A' }}>Category</td>
                    <td className="py-3" style={{ color: '#666' }}>
                      {product.categories && product.categories.length > 0 
                        ? product.categories.join(', ')
                        : 'Uncategorized'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold" style={{ color: '#1A1A1A' }}>Price</td>
                    <td className="py-3" style={{ color: '#2F6B3F' }}>₹{product.variants?.[0]?.sellingPrice || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold" style={{ color: '#1A1A1A' }}>SKU</td>
                    <td className="py-3" style={{ color: '#555' }}>{product.sku || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold" style={{ color: '#1A1A1A' }}>Stock</td>
                    <td className="py-3" style={{ color: product.variants && product.variants[0]?.stockQty > 0 ? '#2F6B3F' : '#D6524A' }}>
                      {product.variants && product.variants[0]?.stockQty > 0 ? 'Available' : 'Out of Stock'}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {activeTab === 'reviews' && (
              <div>
                <p className="text-gray-500 text-center py-8">Reviews are displayed below related products</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts />

      {/* Reviews Section */}
      <ReviewSection productId={productId} />

      {/* Image Viewer Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowImageModal(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-opacity-80 transition-all z-50"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#FFF' }} />
          </button>

          {/* Modal Content */}
          <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Header with product name */}
            <div className="hidden sm:flex items-center justify-between p-4" style={{ backgroundColor: '#F8F6F2', borderBottom: '1px solid #E6E1D8' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>{product.name}</h3>
            </div>

            {/* Main Content - Flex layout */}
            <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6">
              
              {/* Left Thumbnails - Hidden on Mobile */}
              <div className="hidden lg:flex flex-col gap-2 w-20">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setZoomLevel(1);
                    }}
                    className="rounded overflow-hidden transition-all border-2 hover:shadow-md"
                    style={{
                      border: selectedImage === idx ? '2px solid #2F6B3F' : '1px solid #E6E1D8',
                      opacity: selectedImage === idx ? 1 : 0.6,
                      width: '80px',
                      height: '80px'
                    }}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>

              {/* Center Image with Navigation */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-64 sm:min-h-96 lg:min-h-[500px] bg-gray-50 rounded-lg relative group">
                
                {/* Image */}
                <div
                  className="w-full h-full flex items-center justify-center overflow-hidden relative"
                  style={{ maxHeight: '500px' }}
                >
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="object-contain transition-transform duration-200"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      transform: `scale(${zoomLevel})`,
                      padding: '8px'
                    }}
                  />
                </div>

                {/* Left Arrow */}
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setSelectedImage(idx => Math.max(0, idx - 1));
                  }}
                  disabled={selectedImage === 0}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: '#FFF' }} />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setSelectedImage(idx => Math.min(images.length - 1, idx + 1));
                  }}
                  disabled={selectedImage === images.length - 1}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: '#FFF' }} />
                </button>

                {/* Image Counter */}
                <div
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF' }}
                >
                  {selectedImage + 1} / {images.length}
                </div>
              </div>

              {/* Right Thumbnails - Hidden on Mobile */}
              <div className="hidden lg:flex flex-col gap-2 w-20">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setZoomLevel(1);
                    }}
                    className="rounded overflow-hidden transition-all border-2 hover:shadow-md"
                    style={{
                      border: selectedImage === idx ? '2px solid #2F6B3F' : '1px solid #E6E1D8',
                      opacity: selectedImage === idx ? 1 : 0.6,
                      width: '80px',
                      height: '80px'
                    }}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Thumbnails - Visible on Mobile & Tablet */}
            <div className="lg:hidden flex gap-2 overflow-x-auto p-3 sm:p-4" style={{ borderTop: '1px solid #E6E1D8', backgroundColor: '#F8F6F2' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(idx);
                    setZoomLevel(1);
                  }}
                  className="rounded flex-shrink-0 overflow-hidden transition-all border-2"
                  style={{
                    border: selectedImage === idx ? '2px solid #2F6B3F' : '1px solid #E6E1D8',
                    opacity: selectedImage === idx ? 1 : 0.6,
                    width: '60px',
                    height: '60px'
                  }}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6" style={{ backgroundColor: '#F8F6F2', borderTop: '1px solid #E6E1D8' }}>
              
              {/* Zoom Controls */}
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setZoomLevel(z => Math.max(1, z - 0.25))}
                  disabled={zoomLevel <= 1}
                  className="p-2 rounded hover:bg-gray-300 transition-all disabled:opacity-30"
                  style={{ backgroundColor: '#E6E1D8' }}
                  title="Zoom Out"
                >
                  <span style={{ color: '#1A1A1A', fontSize: '16px' }}>−</span>
                </button>
                <div className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E1D8', minWidth: '60px', textAlign: 'center', color: '#1A1A1A' }}>
                  {Math.round(zoomLevel * 100)}%
                </div>
                <button
                  onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))}
                  disabled={zoomLevel >= 3}
                  className="p-2 rounded hover:bg-gray-300 transition-all disabled:opacity-30"
                  style={{ backgroundColor: '#E6E1D8' }}
                  title="Zoom In"
                >
                  <span style={{ color: '#1A1A1A', fontSize: '16px' }}>+</span>
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  disabled={zoomLevel === 1}
                  className="p-2 rounded hover:bg-gray-300 transition-all disabled:opacity-30"
                  style={{ backgroundColor: '#E6E1D8' }}
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" style={{ color: '#1A1A1A' }} />
                </button>
              </div>

              {/* Close Button for Mobile */}
              <button
                onClick={() => setShowImageModal(false)}
                className="sm:hidden px-6 py-2 rounded font-medium text-white transition-all"
                style={{ backgroundColor: '#2F6B3F' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Preview Component */}
      <CartPreview />
    </div>
  );
};

export default ProductPage;
