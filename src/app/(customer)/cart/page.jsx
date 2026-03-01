'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShopContext } from '@/context/ShopContext';
import { NotificationContext } from '@/context/NotificationContext';
import CouponInput from '@/components/CouponInput';
import { sampleProducts } from '@/assets/sampleProducts';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, X } from 'lucide-react';

const CartPage = () => {
  const router = useRouter();
  const { products, cartItems, updateQuantity, appliedCoupon, setAppliedCoupon, couponDiscount, setCouponDiscount } = useContext(ShopContext);
  const { success, error } = useContext(NotificationContext);
  const [cartData, setCartData] = useState([]);
  const [showCouponField, setShowCouponField] = useState(false);

  useEffect(() => {
    const tempData = [];

    Object.keys(cartItems).forEach(itemId => {
      const value = cartItems[itemId];
      if (!value) return;

      let product =
        products.find(p => String(p._id) === String(itemId) || String(p.id) === String(itemId)) ||
        sampleProducts.find(p => String(p.id) === String(itemId));

      if (!product) {
        product = {
          id: itemId,
          name: `Product ${itemId}`,
          price: 0,
          image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'
        };
      }

      // Handle variant structure: {variantWeight: quantity} or simple quantity
      if (typeof value === 'object' && value !== null) {
        // Variant-based product: {variantWeight: quantity}
        Object.entries(value).forEach(([variantWeight, quantity]) => {
          if (quantity > 0) {
            tempData.push({
              id: itemId,
              variantWeight,
              quantity,
              product
            });
          }
        });
      } else if (Number(value) > 0) {
        // Legacy: simple quantity
        tempData.push({
          id: itemId,
          quantity: Number(value),
          product
        });
      }
    });

    setCartData(tempData);
  }, [cartItems, products]);

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon.code);
    setCouponDiscount(coupon.discount);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const subtotal = cartData.reduce((sum, item) => {
    let price = 0;
    
    // Get variant selling price
    if (item.variantWeight && item.product?.variants) {
      const variant = item.product.variants.find(v => v.weight === item.variantWeight);
      if (variant) {
        price = variant.sellingPrice;
      }
    } else if (item.product?.variants && item.product.variants.length > 0) {
      price = item.product.variants[0].sellingPrice;
    }
    
    return sum + price * item.quantity;
  }, 0);

  // Calculate total savings
  const totalSavings = cartData.reduce((sum, item) => {
    let originalPrice = 0;
    let sellingPrice = 0;
    
    if (item.variantWeight && item.product?.variants) {
      const variant = item.product.variants.find(v => v.weight === item.variantWeight);
      if (variant) {
        originalPrice = variant.originalPrice || variant.sellingPrice;
        sellingPrice = variant.sellingPrice;
      }
    } else if (item.product?.variants && item.product.variants.length > 0) {
      originalPrice = item.product.variants[0].originalPrice || item.product.variants[0].sellingPrice;
      sellingPrice = item.product.variants[0].sellingPrice;
    }
    
    const savings = (originalPrice - sellingPrice) * item.quantity;
    return sum + (savings > 0 ? savings : 0);
  }, 0);

  const shipping = subtotal > 499 ? 0 : 50;
  const totalBeforeCoupon = subtotal + shipping;
  const total = Math.max(0, totalBeforeCoupon - couponDiscount);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="py-3 px-4 md:px-8 border-b" style={{ borderColor: '#E6E1D8' }}>
        <div className="max-w-7xl mx-auto mt-3">
          <button
            onClick={() => router.push('/collection')}
            className="flex items-center gap-2 text-xs font-medium tracking-wide"
            style={{ color: '#2F6B3F' }}
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO SHOP
          </button>
        </div>
      </div>

      <section className="py-6 sm:py-12 px-3 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* EMPTY CART */}
          {cartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 sm:mb-8" style={{ backgroundColor: '#F8F6F2' }}>
                <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: '#2F6B3F' }} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
                Your cart is empty
              </h2>
              <button
                onClick={() => router.push('/collection')}
                className="px-8 py-3 rounded-lg font-semibold text-sm"
                style={{ backgroundColor: '#2F6B3F', color: '#FFF' }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (

            /* MAIN GRID */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

              {/* LEFT SIDE — TITLE + CART ITEMS (MOVED UP) */}
              <div className="lg:col-span-2">
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                    Shopping Cart
                  </h1>
                  <p className="text-xs sm:text-sm mt-2" style={{ color: '#777' }}>
                    {cartData.length} item{cartData.length !== 1 ? 's' : ''} in cart
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {cartData.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    // Get the actual price (variant)
                    let actualPrice = 0;
                    let actualOriginalPrice = null;
                    
                    if (item.variantWeight && product.variants) {
                      const variant = product.variants.find(v => v.weight === item.variantWeight);
                      if (variant) {
                        actualPrice = variant.sellingPrice;
                        actualOriginalPrice = variant.originalPrice || null;
                      }
                    } else if (product.variants && product.variants.length > 0) {
                      actualPrice = product.variants[0].sellingPrice;
                      actualOriginalPrice = product.variants[0].originalPrice || null;
                    }
                    
                    const discount = actualOriginalPrice && actualPrice
                      ? Math.round(((actualOriginalPrice - actualPrice) / actualOriginalPrice) * 100)
                      : 0;

                    return (
                      <div
                        key={`${item.id}-${item.variantWeight || 'default'}`}
                        onClick={() => router.push(`/product/${item.id}`)}
                        className="border rounded-lg sm:rounded-xl p-3 sm:p-5 flex gap-3 sm:gap-5 transition-all hover:shadow-md hover:border-opacity-50 cursor-pointer"
                        style={{ borderColor: '#E6E1D8' }}
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#F8F6F2' }}>
                          <img
                            src={product.image || product.images?.[0] || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm sm:text-base leading-tight" style={{ color: '#1A1A1A' }}>
                                {product.name}
                              </h3>
                              {item.variantWeight && (
                                <p className="text-[10px] sm:text-xs mt-1" style={{ color: '#555' }}>
                                  {item.variantWeight}
                                </p>
                              )}
                              {discount > 0 && (
                                <span className="text-[9px] sm:text-xs font-bold mt-1 inline-block px-1 sm:px-2 py-0.5 sm:py-1 rounded tracking-wide" style={{ color: '#FFFFFF', backgroundColor: '#2F6B3F' }}>
                                  SAVE {discount}%
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.id, 0, item.variantWeight);
                                success('Item removed from cart');
                              }}
                              className="p-1.5 sm:p-2 hover:bg-red-50 rounded transition flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#D6524A' }} />
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mt-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-base sm:text-lg" style={{ color: '#D6524A' }}>
                                ₹{actualPrice}
                              </span>
                              {actualOriginalPrice && (
                                <span className="text-xs sm:text-sm line-through" style={{ color: '#BBB' }}>
                                  ₹{actualOriginalPrice}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center border rounded-lg text-sm w-fit" style={{ borderColor: '#E6E1D8' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantWeight);
                                }}
                                className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-50"
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="px-2 sm:px-4 py-1.5 sm:py-2 font-semibold text-xs sm:text-sm">{item.quantity}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, item.quantity + 1, item.variantWeight);
                                }}
                                className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>

                            <div className="text-right font-bold text-base sm:text-lg" style={{ color: '#1A1A1A' }}>
                              ₹{(actualPrice * item.quantity).toFixed(0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => router.push('/collection')}
                  className="flex items-center gap-2 mt-6 sm:mt-8 text-[11px] sm:text-xs font-semibold tracking-wide"
                  style={{ color: '#2F6B3F' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  CONTINUE SHOPPING
                </button>
              </div>

              {/* RIGHT SIDE — PRICE DETAILS */}
              {cartData.length > 0 && (
                <div>
                  <div
                    className="rounded-lg sm:rounded-xl overflow-hidden border sticky top-20 sm:top-24"
                    style={{ borderColor: '#E6E1D8', backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    <div className="px-4 sm:px-6 py-3 sm:py-5 border-b" style={{ borderColor: '#E6E1D8', backgroundColor: '#FAFAF8' }}>
                      <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase" style={{ color: '#555' }}>
                        Price Details
                      </h3>
                    </div>

                    <div className="px-4 sm:px-6 py-3 sm:py-5 space-y-2 sm:space-y-3">
                      {/* Individual Items Breakdown */}
                      <div className="space-y-1.5 sm:space-y-2.5 pb-2 sm:pb-3" style={{ borderBottomColor: '#E6E1D8', borderBottomWidth: '1px' }}>
                        {cartData.map((item, idx) => {
                          let actualPrice = 0;
                          let originalPrice = 0;
                          if (item.variantWeight && item.product?.variants) {
                            const variant = item.product.variants.find(v => v.weight === item.variantWeight);
                            if (variant) {
                              actualPrice = variant.sellingPrice;
                              originalPrice = variant.originalPrice || variant.sellingPrice;
                            }
                          } else if (item.product?.variants && item.product.variants.length > 0) {
                            actualPrice = item.product.variants[0].sellingPrice;
                            originalPrice = item.product.variants[0].originalPrice || item.product.variants[0].sellingPrice;
                          }

                          const itemTotal = originalPrice * item.quantity;
                          const productName = item.product.name.length > 12 
                            ? item.product.name.substring(0, 12) + '...' 
                            : item.product.name;

                          return (
                            <div key={idx} className="flex justify-between items-center text-xs sm:text-sm" style={{ rowGap: '4px' }}>
                              <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
                                <span style={{ color: '#333', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                  {productName}
                                </span>
                                {item.variantWeight && (
                                  <span style={{ color: '#666', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                    {item.variantWeight}
                                  </span>
                                )}
                                <span style={{ color: '#666', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                  ×{item.quantity}
                                </span>
                              </div>
                              <span style={{ color: '#111', fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>₹{itemTotal.toFixed(0)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total Price Row - Original Price */}
                      <div className="flex justify-between items-center pb-2 sm:pb-3" style={{ borderBottomColor: '#E6E1D8', borderBottomWidth: '1px' }}>
                        <span className="text-xs sm:text-sm font-medium" style={{ color: '#666' }}>Price Total</span>
                        <span className="text-xs sm:text-sm font-semibold" style={{ color: '#111' }}>₹{(subtotal + totalSavings).toFixed(0)}</span>
                      </div>

                      {/* Discount Row */}
                      {totalSavings > 0 && (
                        <div className="flex justify-between items-center pb-2 sm:pb-3" style={{ borderBottomColor: '#E6E1D8', borderBottomWidth: '1px' }}>
                          <span className="text-xs sm:text-sm" style={{ color: '#666' }}>Discount</span>
                          <span className="text-xs sm:text-sm font-semibold" style={{ color: '#2F6B3F' }}>−₹{totalSavings.toFixed(0)}</span>
                        </div>
                      )}

                      {/* Subtotal after Discount */}
                      <div className="flex justify-between items-center pb-2 sm:pb-3" style={{ borderBottomColor: '#E6E1D8', borderBottomWidth: '1px' }}>
                        <span className="text-xs sm:text-sm font-medium" style={{ color: '#666' }}>Subtotal</span>
                        <span className="text-xs sm:text-sm font-semibold" style={{ color: '#111' }}>₹{subtotal.toFixed(0)}</span>
                      </div>

                      {/* Delivery Fee Row */}
                      <div className="flex justify-between items-center pb-2 sm:pb-3" style={{ borderBottomColor: '#E6E1D8', borderBottomWidth: '1px' }}>
                        <span className="text-xs sm:text-sm" style={{ color: '#666' }}>Delivery Charge</span>
                        {shipping === 0 ? (
                          <span className="text-xs sm:text-sm font-semibold" style={{ color: '#2F6B3F' }}>FREE</span>
                        ) : (
                          <span className="text-xs sm:text-sm font-semibold" style={{ color: '#111' }}>₹{shipping}</span>
                        )}
                      </div>

                      {/* Coupon Section */}
                      <div className="pb-2 sm:pb-3" style={{ borderBottomColor: '#E6E1D8', borderBottomWidth: '1px' }}>
                        {!appliedCoupon ? (
                          showCouponField ? (
                            <div>
                              <CouponInput 
                                cartTotal={totalBeforeCoupon} 
                                onApplyCoupon={handleApplyCoupon}
                              />
                              <button
                                onClick={() => setShowCouponField(false)}
                                className="text-xs sm:text-sm font-medium mt-2 flex items-center gap-1 hover:opacity-70 transition-opacity"
                                style={{ color: '#666' }}
                              >
                                <X className="w-4 h-4" />
                                Close
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowCouponField(true)}
                              className="text-xs sm:text-sm font-medium hover:opacity-70 transition-opacity"
                              style={{ color: '#2F6B3F' }}
                            >
                              Have a promo code? <span className="font-semibold">Click to apply</span>
                            </button>
                          )
                        ) : (
                          <div className="flex items-center justify-between bg-green-50 px-3 sm:px-4 py-2 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold" style={{ color: '#2F6B3F' }}>
                                {appliedCoupon}
                              </p>
                              <p className="text-[11px] sm:text-xs" style={{ color: '#666' }}>
                                You saved ₹{couponDiscount.toFixed(0)}
                              </p>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="text-[11px] sm:text-xs font-semibold px-3 py-1 rounded hover:opacity-80 transition-opacity"
                              style={{ color: '#D6524A' }}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Coupon Discount Row */}
                      {couponDiscount > 0 && (
                        <div className="flex justify-between items-center pb-2 sm:pb-3" style={{ borderBottomColor: '#E6E1D8', borderBottomWidth: '1px' }}>
                          <span className="text-xs sm:text-sm" style={{ color: '#666' }}>Coupon Discount</span>
                          <span className="text-xs sm:text-sm font-semibold" style={{ color: '#2F6B3F' }}>−₹{couponDiscount.toFixed(0)}</span>
                        </div>
                      )}

                      {/* Total Amount Highlight */}
                      <div className="flex justify-between items-center pt-2 sm:pt-3">
                        <span className="text-sm sm:text-base font-bold" style={{ color: '#111' }}>Total Amount</span>
                        <span className="text-lg sm:text-2xl font-bold" style={{ color: '#2F6B3F' }}>₹{total.toFixed(0)}</span>
                      </div>

                      {/* Savings Badge */}
                      {(totalSavings > 0 || couponDiscount > 0) && (
                        <div className="text-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg mt-2 sm:mt-3" style={{ backgroundColor: '#E8F5E9' }}>
                          <p className="text-[11px] sm:text-xs font-semibold" style={{ color: '#2F6B3F' }}>
                            You save ₹{(totalSavings + couponDiscount).toFixed(0)} with great deals!
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => router.push('/place-order')}
                        className="w-full py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide transition-all mt-3 sm:mt-4"
                        style={{ backgroundColor: '#2F6B3F', color: '#FFF' }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
