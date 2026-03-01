'use client';

import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { ShopContext } from '@/context/ShopContext';
import AuthPrompt from '@/components/AuthPrompt';
import axios from 'axios';
import { Package, ShoppingCart, Info, MessageSquare, LogOut, ChevronRight, Check } from 'lucide-react';

const ProfilePage = () => {
  const router = useRouter();
  const { backendUrl, token, currency, setToken } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  if (!token) {
    return <AuthPrompt title="Your Profile" subtitle="Sign in to view and manage your account information" />;
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  const formatJoinDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'delivered') return { bg: '#E8F5E9', text: '#2F6B3F' };
    if (statusLower === 'processing') return { bg: '#FFF3E0', text: '#E67E22' };
    if (statusLower === 'cancelled') return { bg: '#FFEBEE', text: '#D6524A' };
    return { bg: '#F5F5F5', text: '#666' };
  }

  const loadProfileData = async () => {
    try {
      setLoading(true);

      console.log('Loading profile with token:', token);

      // Load user profile
      const userResponse = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Profile response:', userResponse.data);

      if (userResponse.data.success) {
        setUserData(userResponse.data.user);
      } else {
        console.error('Profile fetch failed:', userResponse.data.message);
      }

      // Load recent orders
      const orderResponse = await axios.post(`${backendUrl}/api/order/userOrders`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Orders response:', orderResponse.data);

      if (orderResponse.data.success) {
        let allOrderItems = [];
        orderResponse.data.orders.slice(0, 3).map((order) => {
          order.items.slice(0, 1).map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id;
            allOrderItems.push(item);
          });
        });
        setOrderData(allOrderItems);
      }
    } catch (error) {
      console.error('Profile load error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadProfileData();
    }
  }, [token]);

  const handleLogout = () => {
    const redirectPath = localStorage.getItem('lastVisitedPath');
    const blockedPaths = ['/login', '/newlogin', '/finish-login'];
    const target = redirectPath && !blockedPaths.includes(redirectPath) ? redirectPath : '/';

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
    router.push(target);
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#FAFAF8' }}>
        <div className='text-center'>
          <div className='text-lg font-semibold text-gray-700'>Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className='min-h-screen py-12'>
      <div className='max-w-6xl mx-auto px-4'>
        
        {/* Profile Header */}
        <div className='bg-white rounded-lg p-8 mb-8 border' style={{ borderColor: '#E6E1D8' }}>
          <div className='flex items-start gap-6'>
            <div className='w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl' style={{ backgroundColor: '#2F6B3F' }}>
              {getInitials(userData?.name || 'User')}
            </div>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-900' style={{ color: '#1A1A1A' }}>
                {userData?.name || 'User'}
              </h1>
              <p className='text-base mt-1' style={{ color: '#666' }}>
                {userData?.email || 'No email'}
              </p>
              <p className='text-sm mt-2' style={{ color: '#999' }}>
                Member since {formatJoinDate(userData?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg p-6 border text-center' style={{ borderColor: '#E6E1D8' }}>
            <div className='text-4xl font-bold' style={{ color: '#2F6B3F' }}>
              {orderData.length || 0}
            </div>
            <div className='text-sm mt-2 font-medium' style={{ color: '#666' }}>
              Total Purchases
            </div>
          </div>
          <div className='bg-white rounded-lg p-6 border text-center' style={{ borderColor: '#E6E1D8' }}>
            <div className='text-4xl font-bold' style={{ color: '#2F6B3F' }}>
              {currency}{orderData.length > 0 ? (orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(0) : '0'}
            </div>
            <div className='text-sm mt-2 font-medium' style={{ color: '#666' }}>
              Total Spent
            </div>
          </div>
          <div className='bg-white rounded-lg p-6 border text-center' style={{ borderColor: '#E6E1D8' }}>
            <div className='text-2xl font-bold' style={{ color: '#2F6B3F' }}>
              Active Member
            </div>
            <div className='text-sm mt-2 font-medium' style={{ color: '#666' }}>
              Account Status
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className='bg-white rounded-lg p-8 mb-8 border' style={{ borderColor: '#E6E1D8' }}>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold' style={{ color: '#1A1A1A' }}>
              Recent Purchases
            </h2>
            <button
              onClick={() => router.push('/orders')}
              className='flex items-center gap-2 font-medium transition'
              style={{ color: '#2F6B3F' }}
            >
              View All <ChevronRight size={18} />
            </button>
          </div>

          {orderData.length > 0 ? (
            <div className='space-y-4'>
              {orderData.map((item, index) => {
                const statusColor = getStatusColor(item.status);
                return (
                  <div key={index} className='flex items-center gap-4 p-4 rounded-lg' style={{ backgroundColor: '#F8F6F2' }}>
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      className='w-20 h-20 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-900'>{item.name}</p>
                      <p className='text-sm mt-1' style={{ color: '#999' }}>
                        {new Date(item.date).toDateString()}
                      </p>
                      <p className='text-sm font-semibold mt-1' style={{ color: '#2F6B3F' }}>
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className='px-4 py-2 rounded-lg text-sm font-semibold' style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                      {item.status}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-12'>
              <Package size={48} className='mx-auto mb-4' style={{ color: '#999' }} />
              <p className='text-gray-600 mb-6'>No purchases yet</p>
              <button
                onClick={() => router.push('/collection')}
                className='px-8 py-3 rounded-lg font-bold text-white transition'
                style={{ backgroundColor: '#2F6B3F' }}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Account Details */}
        <div className='bg-white rounded-lg p-8 mb-8 border' style={{ borderColor: '#E6E1D8' }}>
          <h2 className='text-2xl font-bold mb-6' style={{ color: '#1A1A1A' }}>
            Account Details
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <p className='text-sm font-medium' style={{ color: '#999' }}>Email Address</p>
              <p className='text-base mt-2 font-semibold text-gray-900'>{userData?.email || 'N/A'}</p>
            </div>
            <div>
              <p className='text-sm font-medium' style={{ color: '#999' }}>Account Status</p>
              <p className='text-base mt-2 font-semibold flex items-center gap-2' style={{ color: '#2F6B3F' }}>
                <Check size={18} /> Active
              </p>
            </div>
            <div>
              <p className='text-sm font-medium' style={{ color: '#999' }}>Member Since</p>
              <p className='text-base mt-2 font-semibold text-gray-900'>{formatJoinDate(userData?.createdAt)}</p>
            </div>
            <div>
              <p className='text-sm font-medium' style={{ color: '#999' }}>Last Updated</p>
              <p className='text-base mt-2 font-semibold text-gray-900'>{formatJoinDate(userData?.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-lg p-8 mb-8 border' style={{ borderColor: '#E6E1D8' }}>
          <h2 className='text-2xl font-bold mb-6' style={{ color: '#1A1A1A' }}>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button
              onClick={() => router.push('/orders')}
              className='p-4 rounded-lg border transition hover:shadow-md flex flex-col items-center gap-3'
              style={{ borderColor: '#E6E1D8', color: '#1A1A1A' }}
            >
              <Package size={28} style={{ color: '#2F6B3F' }} />
              <span className='font-semibold text-sm'>My Purchases</span>
            </button>
            <button
              onClick={() => router.push('/collection')}
              className='p-4 rounded-lg border transition hover:shadow-md flex flex-col items-center gap-3'
              style={{ borderColor: '#E6E1D8', color: '#1A1A1A' }}
            >
              <ShoppingCart size={28} style={{ color: '#2F6B3F' }} />
              <span className='font-semibold text-sm'>Continue Shopping</span>
            </button>
            <button
              onClick={() => router.push('/about')}
              className='p-4 rounded-lg border transition hover:shadow-md flex flex-col items-center gap-3'
              style={{ borderColor: '#E6E1D8', color: '#1A1A1A' }}
            >
              <Info size={28} style={{ color: '#2F6B3F' }} />
              <span className='font-semibold text-sm'>About Us</span>
            </button>
            <button
              onClick={() => router.push('/contact')}
              className='p-4 rounded-lg border transition hover:shadow-md flex flex-col items-center gap-3'
              style={{ borderColor: '#E6E1D8', color: '#1A1A1A' }}
            >
              <MessageSquare size={28} style={{ color: '#2F6B3F' }} />
              <span className='font-semibold text-sm'>Contact Support</span>
            </button>
          </div>
        </div>

        {/* Need Help Section */}
        <div className='bg-white rounded-lg p-8 mb-8 border' style={{ borderColor: '#E6E1D8', backgroundColor: '#F8F6F2' }}>
          <h2 className='text-2xl font-bold mb-4' style={{ color: '#1A1A1A' }}>
            Need Help?
          </h2>
          <p className='mb-6' style={{ color: '#666' }}>
            Have questions about your account or purchases? Our support team is here to help.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className='px-8 py-3 rounded-lg font-bold text-white transition'
            style={{ backgroundColor: '#2F6B3F' }}
          >
            Contact Our Support Team
          </button>
        </div>

        {/* Logout Button */}
        <div className='flex justify-end'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-8 py-3 rounded-lg font-bold border-2 transition'
            style={{ borderColor: '#D6524A', color: '#D6524A' }}
          >
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;
