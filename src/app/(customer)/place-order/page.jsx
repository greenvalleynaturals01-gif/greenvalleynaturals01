'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShopContext } from '@/context/ShopContext';
import { NotificationContext } from '@/context/NotificationContext';
import { sampleProducts } from '@/assets/sampleProducts';
import axios from 'axios';
import { ArrowLeft, Lock } from 'lucide-react';

const PlaceOrderPage = () => {
  const router = useRouter();
  const { backendUrl, token, cartItems, setCartItems, delivery_fee, products, appliedCoupon, couponDiscount, setAppliedCoupon, setCouponDiscount } = useContext(ShopContext);
  const { error: showError, success: showSuccess } = useContext(NotificationContext);
  const [method, setMethod] = useState('cod');
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    Object.keys(cartItems).forEach(itemId => {
      const value = cartItems[itemId];
      if (!value) return;

      let product =
        products.find(p => String(p._id) === String(itemId) || String(p.id) === String(itemId)) ||
        sampleProducts.find(p => String(p._id) === String(itemId) || String(p.id) === String(itemId));

      if (!product) {
        product = {
          _id: itemId,
          id: itemId,
          name: `Product ${itemId}`,
          price: 0,
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

  const shipping = subtotal > 499 ? 0 : delivery_fee;
  const discountAmount = couponDiscount > 0 ? Math.min(couponDiscount, subtotal) : 0;
  const total = subtotal + shipping - discountAmount;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Transform cartData into order items format
      let orderItems = cartData.map(item => {
        const images = item.product?.images || [item.product?.image];
        const firstImage = images && images.length > 0 ? 
          (typeof images[0] === 'string' ? images[0] : images[0]?.url) : '';

        let itemObj = {
          productId: item.product?._id || item.product?.id,
          name: item.product?.name || `Product ${item.id}`,
          quantity: item.quantity,
          image: firstImage
        };

        // Add variant info if exists
        if (item.variantWeight && item.product?.variants) {
          const variant = item.product.variants.find(v => v.weight === item.variantWeight);
          if (variant) {
            itemObj.variant = {
              weight: item.variantWeight,
              price: variant.sellingPrice
            };
          }
        } else if (item.product?.variants && item.product.variants.length > 0) {
          // Use first variant price
          itemObj.variant = {
            weight: item.product.variants[0].weight,
            price: item.product.variants[0].sellingPrice
          };
        }

        return itemObj;
      });

      let orderData = {
        address: formData,
        items: orderItems,
        amount: total,
        couponCode: appliedCoupon || null,
        discountAmount: discountAmount
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (response.data.success) {
            showSuccess('Your order has been placed successfully! 🎉');
            setCartItems({});
            setAppliedCoupon(null);
            setCouponDiscount(0);
            router.push('/orders');
          } else {
            showError(response.data.message || 'Unable to place order');
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      showError(error.message || 'Unable to place order');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="py-3 px-4 md:px-8 border-b" style={{ borderColor: '#E6E1D8' }}>
        <div className="max-w-7xl mx-auto mt-3">
          <button
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2 text-xs font-medium tracking-wide"
            style={{ color: '#2F6B3F' }}
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO CART
          </button>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="py-6 sm:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
              Place Order
            </h1>
            <p className="text-xs sm:text-sm mt-2" style={{ color: '#999' }}>
              Review your details and confirm your purchase
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column: Delivery Form */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Delivery Information Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 tracking-tight" style={{ color: '#1A1A1A' }}>
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="flex gap-4">
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                        First Name <span style={{ color: '#D6524A' }}>*</span>
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className="border py-3 px-4 w-full text-sm rounded transition"
                        style={{ borderColor: '#E6E1D8' }}
                        type="text"
                        placeholder="Enter first name"
                        onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                        Last Name <span style={{ color: '#D6524A' }}>*</span>
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className="border py-3 px-4 w-full text-sm rounded transition"
                        style={{ borderColor: '#E6E1D8' }}
                        type="text"
                        placeholder="Enter last name"
                        onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                      Email Address <span style={{ color: '#D6524A' }}>*</span>
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="email"
                      value={formData.email}
                      className="border py-3 px-4 w-full text-sm rounded transition"
                      style={{ borderColor: '#E6E1D8' }}
                      type="email"
                      placeholder="Enter email address"
                      onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                      onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                      Street Address <span style={{ color: '#D6524A' }}>*</span>
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="street"
                      value={formData.street}
                      className="border py-3 px-4 w-full text-sm rounded transition"
                      style={{ borderColor: '#E6E1D8' }}
                      type="text"
                      placeholder="Enter street address"
                      onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                      onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                    />
                  </div>

                  {/* City & State */}
                  <div className="flex gap-4">
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                        City <span style={{ color: '#D6524A' }}>*</span>
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className="border py-3 px-4 w-full text-sm rounded transition"
                        style={{ borderColor: '#E6E1D8' }}
                        type="text"
                        placeholder="Enter city"
                        onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                        State <span style={{ color: '#D6524A' }}>*</span>
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="state"
                        value={formData.state}
                        className="border py-3 px-4 w-full text-sm rounded transition"
                        style={{ borderColor: '#E6E1D8' }}
                        type="text"
                        placeholder="Enter state"
                        onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                      />
                    </div>
                  </div>

                  {/* Zipcode & Country */}
                  <div className="flex gap-4">
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                        Zipcode <span style={{ color: '#D6524A' }}>*</span>
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="zipcode"
                        value={formData.zipcode}
                        className="border py-3 px-4 w-full text-sm rounded transition"
                        style={{ borderColor: '#E6E1D8' }}
                        type="text"
                        placeholder="Enter zipcode"
                        onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                        Country <span style={{ color: '#D6524A' }}>*</span>
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="country"
                        value={formData.country}
                        className="border py-3 px-4 w-full text-sm rounded transition"
                        style={{ borderColor: '#E6E1D8' }}
                        type="text"
                        placeholder="Enter country"
                        onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#333' }}>
                      Phone Number <span style={{ color: '#D6524A' }}>*</span>
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="phone"
                      value={formData.phone}
                      className="border py-3 px-4 w-full text-sm rounded transition"
                      style={{ borderColor: '#E6E1D8' }}
                      type="tel"
                      placeholder="Enter phone number"
                      onFocus={(e) => e.target.style.borderColor = '#2F6B3F'}
                      onBlur={(e) => e.target.style.borderColor = '#E6E1D8'}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 tracking-tight" style={{ color: '#1A1A1A' }}>
                  Payment Method <span style={{ color: '#D6524A' }}>*</span>
                </h2>
                <div className="space-y-3">
                  <div
                    onClick={() => setMethod('card')}
                    className="flex items-center gap-4 border p-4 cursor-pointer rounded transition"
                    style={{
                      borderColor: method === 'card' ? '#2F6B3F' : '#E6E1D8',
                      backgroundColor: method === 'card' ? '#F0F8F4' : '#FFF'
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: method === 'card' ? '#2F6B3F' : '#E6E1D8'
                      }}
                    >
                      {method === 'card' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2F6B3F' }}></div>
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                      Credit/Debit Card • UPI • Net Banking
                    </span>
                  </div>

                  <div
                    onClick={() => setMethod('cod')}
                    className="flex items-center gap-4 border p-4 cursor-pointer rounded transition"
                    style={{
                      borderColor: method === 'cod' ? '#2F6B3F' : '#E6E1D8',
                      backgroundColor: method === 'cod' ? '#F0F8F4' : '#FFF'
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: method === 'cod' ? '#2F6B3F' : '#E6E1D8'
                      }}
                    >
                      {method === 'cod' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2F6B3F' }}></div>
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                      Cash on Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div>
                {/* Header */}
                <div className="pb-3 sm:pb-4 mb-3 sm:mb-4 border-b" style={{ borderColor: '#E6E1D8' }}>
                  <h2 className="text-base sm:text-lg font-bold" style={{ color: '#1A1A1A' }}>Order Summary</h2>
                  <p className="text-[11px] sm:text-xs mt-1" style={{ color: '#999' }}>
                    {cartData.length} item{cartData.length !== 1 ? 's' : ''} in your order
                  </p>
                </div>

                {/* Item Breakdown */}
                {cartData.length > 0 && (
                  <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b" style={{ borderColor: '#E6E1D8' }}>
                    <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ color: '#1A1A1A' }}>Items</h3>
                    <div className="space-y-2">
                      {cartData.map((item) => (
                        <div key={item.id} className="flex items-start justify-between gap-2 text-xs">
                          <div className="flex-1">
                            <p className="font-medium" style={{ color: '#1A1A1A' }}>{item.product.name}</p>
                            <p style={{ color: '#999' }}>Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold" style={{ color: '#1A1A1A' }}>₹{(() => {
                            let price = 0;
                            if (item.variantWeight && item.product?.variants) {
                              const variant = item.product.variants.find(v => v.weight === item.variantWeight);
                              price = variant ? variant.sellingPrice : 0;
                            } else if (item.product?.variants?.length > 0) {
                              price = item.product.variants[0].sellingPrice;
                            }
                            return (price * item.quantity).toFixed(2);
                          })()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b" style={{ borderColor: '#E6E1D8' }}>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span style={{ color: '#666' }}>Subtotal</span>
                    <span style={{ color: '#1A1A1A' }}>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span style={{ color: '#666' }}>Delivery</span>
                    <span style={{ color: '#2F6B3F', fontWeight: '600' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span style={{ color: '#666' }}>Coupon Discount{appliedCoupon && ` (${appliedCoupon})`}</span>
                      <span style={{ color: '#2F6B3F', fontWeight: '600' }}>-₹{discountAmount}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="p-3 sm:p-4 rounded mb-4 sm:mb-6" style={{ backgroundColor: '#F8F6F2' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-semibold" style={{ color: '#1A1A1A' }}>Total Amount</span>
                    <span className="text-base sm:text-lg font-bold" style={{ color: '#2F6B3F' }}>₹{total}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 sm:py-4 rounded font-bold text-xs sm:text-sm uppercase tracking-wide transition"
                style={{
                  backgroundColor: '#2F6B3F',
                  color: '#FFF'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#25612F'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2F6B3F'}
              >
                Place Order
              </button>
              <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 text-[11px] sm:text-xs" style={{ borderTop: '1px solid #E6E1D8', color: '#999' }}>
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#2F6B3F', flexShrink: 0 }} />
                Your payment is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrderPage;
