'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ShopContext } from '@/context/ShopContext';
import AuthPrompt from '@/components/AuthPrompt';
import axios from 'axios';
import { Bell, Trash2, CheckCircle, Circle, Loader } from 'lucide-react';

const NotificationPageComponent = () => {
  const router = useRouter();
  const { token, backendUrl } = useContext(ShopContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [marking, setMarking] = useState(false);

 if (!token) {
    return <AuthPrompt title="Your Notifications" subtitle="Sign in to stay updated with your orders and offers" />;
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const loadNotifications = async () => {
    if (!token || !backendUrl) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/notification/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.log('Error loading notifications:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      setMarking(true);
      await axios.put(
        `${backendUrl}/api/notification/read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.log('Error marking as read:', error?.response?.data || error.message);
    } finally {
      setMarking(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarking(true);
      for (const notif of notifications) {
        if (!notif.isRead) {
          await axios.put(
            `${backendUrl}/api/notification/read/${notif._id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.log('Error marking all as read:', error?.response?.data || error.message);
    } finally {
      setMarking(false);
    }
  };

  const clearReadNotifications = async () => {
    try {
      setMarking(true);
      await axios.delete(
        `${backendUrl}/api/notification/clear`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev => prev.filter(notif => !notif.isRead));
    } catch (error) {
      console.log('Error clearing notifications:', error?.response?.data || error.message);
    } finally {
      setMarking(false);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    return true;
  });

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-8 h-8 text-[#2F6B3F]" />
            <h1 className="text-4xl font-bold text-[#1A1A1A]">Notifications</h1>
          </div>
          <p className="text-base text-[#666]">Stay updated with your orders and offers</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E6E1D8] p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-[#2F6B3F] text-white'
                    : 'bg-[#F8F6F2] text-[#3A3A3A] hover:bg-[#F0EDE6]'
                }`}
              >
                All Notifications
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'unread'
                    ? 'bg-[#2F6B3F] text-white'
                    : 'bg-[#F8F6F2] text-[#3A3A3A] hover:bg-[#F0EDE6]'
                }`}
              >
                Unread
              </button>
            </div>

            <div className="flex gap-2">
              {notifications.some(notif => !notif.isRead) && (
                <button
                  onClick={markAllAsRead}
                  disabled={marking}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#E8F5E9] text-[#2F6B3F] hover:bg-[#D4EDDA] transition disabled:opacity-50"
                >
                  {marking ? 'Processing...' : 'Mark All as Read'}
                </button>
              )}
              {notifications.some(notif => notif.isRead) && (
                <button
                  onClick={clearReadNotifications}
                  disabled={marking}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#FFE8E8] text-[#D6524A] hover:bg-[#FFCDD2] transition disabled:opacity-50"
                >
                  {marking ? 'Processing...' : 'Clear Read'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-lg border border-[#E6E1D8] p-8 text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto text-[#2F6B3F] mb-4" />
              <p className="text-[#666]">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif._id}
                className={`bg-white rounded-lg border transition group hover:shadow-md cursor-pointer ${
                  notif.isRead
                    ? 'border-[#E6E1D8] hover:border-[#D4D4D4]'
                    : 'border-[#2F6B3F] bg-gradient-to-r from-[#F0FFF4] to-white'
                }`}
                onClick={() => {
                  if (!notif.isRead) {
                    markAsRead(notif._id);
                  }
                  if (notif.link) {
                    router.push(notif.link);
                  }
                }}
              >
                <div className="px-6 py-4 flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {notif.isRead ? (
                      <CheckCircle className="w-5 h-5 text-[#999]" strokeWidth={1.5} />
                    ) : (
                      <Circle className="w-5 h-5 text-[#2F6B3F] fill-[#2F6B3F]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className={`text-base font-semibold ${
                          notif.isRead ? 'text-[#666]' : 'text-[#1A1A1A]'
                        }`}>
                          {notif.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          notif.isRead ? 'text-[#999]' : 'text-[#3A3A3A]'
                        }`}>
                          {notif.message}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          notif.type === 'broadcast'
                            ? 'bg-[#FFE8E8] text-[#D6524A]'
                            : notif.type === 'personal'
                            ? 'bg-[#E8F5E9] text-[#2F6B3F]'
                            : 'bg-[#E3F2FD] text-[#1976D2]'
                        }`}>
                          {notif.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-[#999]">
                        {getTimeAgo(notif.createdAt)}
                      </p>
                      {notif.link && !notif.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(notif.link);
                          }}
                          className="text-xs font-medium text-[#2F6B3F] hover:underline"
                        >
                          View Details →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-[#E6E1D8] p-8 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-[#DDD]" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications Yet'}
              </h3>
              <p className="text-[#666] mb-6">
                {filter === 'unread'
                  ? 'You\'re all caught up!'
                  : 'Start shopping to receive order updates and special offers'}
              </p>
              <button
                onClick={() => router.push('/collection')}
                className="px-6 py-2 bg-[#2F6B3F] text-white rounded-lg font-medium hover:bg-[#1d5530] transition"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPageComponent;
