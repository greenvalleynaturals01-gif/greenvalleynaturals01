'use client';

import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShopContext } from '../context/ShopContext';
import { auth } from '../Config';
import axios from 'axios';
import { User, Package, Heart, LogOut, LogIn, Menu, X, MapPin, ChevronDown, Search, Bell, ShoppingCart, Lock, FileText, Home, Store, Info, HelpCircle, Phone, Truck } from 'lucide-react';
import DeliveryLocation from './DeliveryLocation';

// Desktop Navigation Links
const DESKTOP_NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/collection' },
  { label: 'About Us', path: '/about' },
  { label: 'Help & Support', path: '/help-support' },
  { label: 'Contact', path: '/contact' },
];

// Sidebar Navigation Links
const SIDEBAR_NAV_LINKS = [
  { iconName: 'Home', label: 'Home', path: '/' },
  { iconName: 'Store', label: 'Shop', path: '/collection' },
  { iconName: 'Info', label: 'About Us', path: '/about' },
  { iconName: 'HelpCircle', label: 'Help & Support', path: '/help-support' },
  { iconName: 'Phone', label: 'Contact', path: '/contact' },
  { iconName: 'Lock', label: 'Privacy Policy', path: '/privacy' },
  { iconName: 'FileText', label: 'Terms & Conditions', path: '/terms' },
];

const ICON_MAP = {
  Home: Home,
  Store: Store,
  Info: Info,
  HelpCircle: HelpCircle,
  Phone: Phone,
  Lock: Lock,
  FileText: FileText,
};

const renderIcon = (iconName) => {
  const IconComponent = ICON_MAP[iconName];
  return IconComponent ? <IconComponent className="w-5 h-5" strokeWidth={1.5} /> : null;
};

export default function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showPromoBar, setShowPromoBar] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const { token, cartCount, logout, products, backendUrl } = useContext(ShopContext);
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = Boolean(token);
  const accountMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const sidebarRef = useRef(null);
  const categoriesRef = useRef(null);
  const megaMenuRef = useRef(null);
  const searchRef = useRef(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSidebar]);

  useEffect(() => {
    if (showMobileSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileSearch]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    } catch {
      setWishlistCount(0);
    }
  }, []);

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
    if (!isLoggedIn || !backendUrl || !token) {
      return;
    }
    
    try {
      setNotificationsLoading(true);
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
      setNotificationsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!isLoggedIn || !backendUrl || !token) {
      return;
    }
    
    try {
      const response = await axios.get(
        `${backendUrl}/api/notification/unread`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.log('Error loading unread count:', error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token && backendUrl) {
      loadNotifications();
      loadUnreadCount();
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, token, backendUrl]);

  const markAsRead = async (notificationId) => {
    if (!backendUrl || !token) return;
    
    try {
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
      loadUnreadCount();
    } catch (error) {
      console.log('Error marking notification as read:', error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setShowMegaMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const PROMO_THRESHOLD = 10;
    const NAV_HIDE_THRESHOLD = 200;
    const SCROLL_THRESHOLD = 5;

    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY.current;

      if (delta > SCROLL_THRESHOLD) {
        if (currentScroll > PROMO_THRESHOLD) {
          setShowPromoBar(false);
        }

        if (currentScroll > NAV_HIDE_THRESHOLD) {
          setShowNavbar(false);
        }
      }

      if (delta < -SCROLL_THRESHOLD) {
        setShowNavbar(true);
      }

      if (currentScroll <= PROMO_THRESHOLD) {
        setShowPromoBar(true);
      }

      lastScrollY.current = currentScroll;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const megaMenuCategories = [
    'Wheat Flour',
    'Beans',
    'Ragi',
    'Bajra',
    'Makka',
    'Chana Dal Besan',
    'Jow',
    'Multigrain'
  ];

  const megaMenuDiscover = [
    { label: 'Best Sellers', path: '/collection?sort=bestseller' },
    { label: 'New Arrivals', path: '/collection?sort=newest' },
    { label: 'Combo Packs', path: '/collection?tag=combo' },
    { label: 'Offers', path: '/collection?tag=offer' },
  ];

  const filteredProducts = useMemo(() => {
    if (searchInput.length < 2) return [];
    return products
      .filter(product =>
        product.name.toLowerCase().includes(searchInput.toLowerCase())
      )
      .slice(0, 6);
  }, [searchInput, products]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value.length >= 2) {
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  const handleSelectProduct = (productId) => {
    router.push(`/product/${productId}`);
    setSearchInput('');
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
  };

  const getProductImage = (product) => {
    if (Array.isArray(product.images)) {
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      } else if (product.images[0]?.url) {
        return product.images[0].url;
      }
    }
    return null;
  };

  const getProductPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return Number(product.variants[0].sellingPrice) || 0;
    }
    return 0;
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      router.push(`/collection?search=${searchInput}`);
      setSearchInput('');
    }
  };

  const handleCategoryScroll = (direction) => {
    const container = categoriesRef.current;
    if (!container) return;
    
    const scrollAmount = 200;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScroll = () => {
    const container = categoriesRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    const container = categoriesRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#E6E1D8] transition-transform duration-400 ease-out"
      style={{
        transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
        willChange: 'transform'
      }}
    >
      {/* Top Promo Bar */}
      <div 
        className={`bg-[#2F6B3F] text-white text-xs sm:text-sm lg:text-sm transition-all duration-400 overflow-hidden border-b border-[#2F6B3F] ${showPromoBar ? 'py-2.5 sm:py-3 lg:py-3' : 'h-0 py-0'}`}
      >
        <div className="w-full max-w-350 2xl:max-w-400 mx-auto px-3 sm:px-6 lg:px-8 flex flex-row items-center gap-2 sm:gap-4">
          <div className="flex sm:shrink-0">
            <DeliveryLocation />
          </div>
          <span className="flex items-center gap-2 justify-center flex-1 text-center sm:text-left text-xs sm:text-sm">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">Free Delivery Above ₹499 | 100% Organic & Fresh</span>
            <span className="sm:hidden">Free Delivery | 100% Organic</span>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-2 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-350 2xl:max-w-400 mx-auto py-4 sm:py-6 lg:py-5 flex items-center justify-between gap-1.5 sm:gap-4 lg:gap-8 xl:gap-12 min-w-0">
          
          {/* MOBILE LAYOUT */}
          <div className="md:hidden flex items-center w-full gap-2 sm:gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 sm:p-2.5 hover:bg-[#F8F6F2] rounded-lg transition-all shrink-0"
              title="Menu"
            >
              <Menu className="w-6 h-6 text-[#5B4636]" strokeWidth={1.5} />
            </button>

            <Link href="/" className="flex-1 flex justify-start pl-0 sm:pl-1 shrink-0 min-w-0">
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="text-lg sm:text-xl font-bold text-[#2F6B3F] tracking-tight whitespace-nowrap">
                  GV
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#5B4636] whitespace-nowrap hidden xs:inline">
                  Naturals
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                onClick={() => setShowMobileSearch(true)}
                className="p-2 sm:p-2.5 hover:bg-[#F8F6F2] rounded-lg transition-all"
                title="Search"
              >
                <Search className="w-6 h-6 text-[#5B4636]" strokeWidth={2} />
              </button>

              <Link 
                href="/notifications"
                className="p-2 sm:p-2.5 hover:bg-[#F8F6F2] rounded-lg transition-all relative flex items-center"
                title="Notifications"
              >
                <Bell className="w-6 h-6 text-[#5B4636]" strokeWidth={1.5} />
                {isLoggedIn && unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D6524A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                    {unreadCount > 9 ? '9' : unreadCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-10 sm:min-h-11 rounded-lg hover:bg-[#1d5530] transition-all bg-[#2F6B3F] hover:shadow-lg text-white relative group">
                <ShoppingCart className="w-5 h-5 k-0" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#D6A84A] text-[#5B4636]">
                    {cartCount > 9 ? '9' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:flex items-center justify-between w-full gap-3 sm:gap-4 lg:gap-8 xl:gap-12">
            <Link href="/" className="shrink-0 min-w-0">
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2F6B3F] tracking-tight whitespace-nowrap">
                  Green Valley
                </span>
                <span className="text-sm sm:text-lg lg:text-[22px] font-medium text-[#5B4636] whitespace-nowrap">
                  Naturals
                </span>
              </div>
            </Link>

            <div ref={searchRef} className="flex flex-1 items-center justify-center px-4 lg:px-8">
              <div className="relative w-full max-w-125 lg:max-w-150 xl:max-w-175">
                <input
                  type="text"
                  placeholder="Search groceries..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearch}
                  className="w-full px-4 py-3 pl-12 rounded-lg focus:outline-none text-base bg-[#F8F6F2] border border-[#E6E1D8] text-[#3A3A3A] focus:ring-2 focus:ring-[#2F6B3F] focus:ring-opacity-30 focus:border-[#2F6B3F] transition-all"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#8A6F55]" strokeWidth={1.5} />

                {showSearchDropdown && searchInput.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl border border-gray-200 rounded-lg z-50 max-h-[60vh] overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <div>
                        <div className="px-4 py-3 bg-linear-to-r from-[#F8F6F2] to-white border-b border-gray-100 sticky top-0">
                          <p className="text-xs font-semibold text-[#5B4636] uppercase tracking-wide">
                            Results for "{searchInput}"
                          </p>
                        </div>

                        <div className="divide-y divide-gray-100">
                          {filteredProducts.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => handleSelectProduct(product._id)}
                              className="group flex items-center gap-4 w-full px-5 py-4 hover:bg-[#F8F6F2] cursor-pointer transition-colors text-left hover:shadow-sm"
                            >
                              <div className="shrink-0">
                                {getProductImage(product) ? (
                                  <img
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-md border border-gray-200 bg-white p-1"
                                    onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-linear-to-br from-[#F8F6F2] to-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                                    <Search className="w-6 h-6 text-[#8A6F55]" strokeWidth={1.5} />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                  Organic & Fresh
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#2F6B3F]">
                                    ₹{getProductPrice(product)}
                                  </span>
                                  {product.variants && product.variants[0]?.originalPrice > getProductPrice(product) && (
                                    <>
                                      <span className="text-xs line-through text-gray-400">
                                        ₹{product.variants[0].originalPrice}
                                      </span>
                                      <span className="text-xs font-bold text-red-600">
                                        {Math.round(((product.variants[0].originalPrice - getProductPrice(product)) / product.variants[0].originalPrice) * 100)}% off
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="shrink-0 text-gray-300 group-hover:text-[#2F6B3F]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            router.push(`/collection?search=${searchInput}`);
                            setSearchInput('');
                            setShowSearchDropdown(false);
                          }}
                          className="w-full px-5 py-3 text-center text-sm font-semibold text-[#2F6B3F] bg-linear-to-r from-[#F8F6F2] to-white hover:bg-[#F0EDE8] border-t border-gray-100 transition-colors"
                        >
                          View all results for "{searchInput}"
                        </button>
                      </div>
                    ) : (
                      <div className="px-6 py-12 text-center">
                        <div className="flex justify-center mb-3">
                          <Search className="w-12 h-12 text-gray-300" strokeWidth={1} />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">No products found</p>
                        <p className="text-xs text-gray-400">Try different keywords</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isLoggedIn && (
                <div 
                  ref={notificationRef} 
                  className="relative hidden sm:block"
                  onMouseEnter={() => setShowNotifications(true)}
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <Link href="/notifications" className="p-2 hover:bg-[#F8F6F2] rounded-lg transition-all relative inline-block">
                    <Bell className="w-5 h-5 text-[#5B4636]" strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D6524A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E6E1D8] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto animate-in fade-in duration-200">
                      <div className="px-4 py-3 border-b border-[#E6E1D8] sticky top-0 bg-white flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#5B4636]">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => {
                              axios.delete(
                                `${backendUrl}/api/notification/clear`,
                                { headers: { Authorization: `Bearer ${token}` } }
                              ).then(() => {
                                loadNotifications();
                                loadUnreadCount();
                              }).catch(error => console.log('Error clearing notifications:', error));
                            }}
                            className="text-xs text-[#2F6B3F] hover:underline font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      
                      {notificationsLoading ? (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-[#8A6F55]">Loading...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`px-4 py-2.5 border-b border-[#F0EDE6] hover:bg-[#F8F6F2] cursor-pointer transition-all flex items-start gap-3 ${
                              !notif.isRead ? 'bg-[#F8F6F2]' : ''
                            }`}
                            onClick={() => {
                              if (!notif.isRead) {
                                markAsRead(notif._id);
                              }
                              if (notif.link) {
                                router.push(notif.link);
                                setShowNotifications(false);
                              }
                            }}
                          >
                            <div className="flex-1">
                              <p className="text-sm text-[#3A3A3A] font-medium">{notif.title}</p>
                              <p className="text-xs text-[#8A6F55] mt-0.5">{notif.message}</p>
                              <p className="text-xs text-[#AAA] mt-1">{getTimeAgo(notif.createdAt)}</p>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 bg-[#2F6B3F] rounded-full mt-1 shrink-0" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <Bell className="w-12 h-12 mx-auto mb-2 text-[#DDD]" strokeWidth={1} />
                          <p className="text-sm text-[#8A6F55] font-medium">No notifications yet</p>
                          <p className="text-xs text-[#AAA] mt-1">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Link href="/wishlist" className="hidden lg:flex items-center px-3 py-2 hover:bg-[#F8F6F2] rounded-lg transition-all relative">
                <Heart className="w-5 h-5 text-[#D6524A]" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D6524A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="flex items-center gap-2 px-3 py-2 min-h-11 rounded-lg hover:bg-[#1d5530] transition-all bg-[#2F6B3F] hover:shadow-md">
                <ShoppingCart className="w-5 h-5 text-white" strokeWidth={1.5} />
                <span className="hidden sm:inline text-base font-semibold text-white">Cart</span>
                {cartCount > 0 && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#D6A84A] text-[#5B4636]">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div 
                ref={accountMenuRef}
                className="relative hidden md:block"
              >
                {isLoggedIn ? (
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#F8F6F2] rounded-lg transition-all"
                  >
                    <User className="w-5 h-5 text-[#5B4636]" strokeWidth={1.5} />
                    <span className="hidden md:inline whitespace-nowrap text-base font-medium text-[#3A3A3A]">
                      Account
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#5B4636] transition-transform" style={{ transform: showAccountMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#F8F6F2] rounded-lg transition-all"
                  >
                    <LogIn className="w-5 h-5 text-[#5B4636]" strokeWidth={1.5} />
                    <span className="hidden md:inline whitespace-nowrap text-base font-medium text-[#3A3A3A]">
                      Login
                    </span>
                  </button>
                )}
                {showAccountMenu && isLoggedIn && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E6E1D8] rounded-lg shadow-xl z-50 animate-in fade-in duration-200">
                    <div className="px-4 py-3 border-b border-[#E6E1D8] bg-[#F8F6F2]">
                      <p className="text-xs font-bold text-[#8A6F55] uppercase tracking-wide">Account</p>
                      <p className="text-sm font-semibold text-[#2F6B3F] truncate mt-1">{userEmail}</p>
                    </div>

                    <button
                      onClick={() => {
                        router.push('/orders');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-[#F8F6F2] flex items-center gap-3 transition-colors border-b border-[#F0EDE6]"
                    >
                      <Package className="w-4 h-4 text-[#5B4636]" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/wishlist');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-[#F8F6F2] flex items-center gap-3 transition-colors border-b border-[#F0EDE6]"
                    >
                      <Heart className="w-4 h-4 text-[#D6524A]" />
                      <span>Wishlist</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/notifications');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-[#F8F6F2] flex items-center gap-3 transition-colors border-b border-[#F0EDE6]"
                    >
                      <Bell className="w-4 h-4 text-[#5B4636]" />
                      <span>Notifications</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-[#F8F6F2] flex items-center gap-3 transition-colors border-b border-[#F0EDE6]"
                    >
                      <User className="w-4 h-4 text-[#5B4636]" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowAccountMenu(false);
                        router.push('/login');
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-[#D6524A] hover:bg-[#FFE8E6] flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowSidebar(true)}
                className="hidden md:flex p-2 hover:bg-[#F8F6F2] rounded-lg transition-all"
              >
                <Menu className="w-5 h-5 text-[#5B4636]" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <nav className="hidden md:block lg:block border-t border-[#E6E1D8] shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-350 2xl:max-w-400 mx-auto flex items-center gap-8 xl:gap-10 py-4">
            {DESKTOP_NAV_LINKS.map((link) => (
              <div key={link.path} ref={link.label === 'Shop' ? megaMenuRef : null}>
                {link.label === 'Shop' ? (
                  <div className="relative group">
                    <Link
                      href={link.path}
                      className={`py-2 px-1 text-sm font-medium transition-all duration-300 border-b-2 flex items-center gap-1 ${
                        pathname === link.path
                          ? 'text-[#2F6B3F] border-b-[#2F6B3F]'
                          : 'text-[#3A3A3A] border-b-transparent hover:text-[#2F6B3F] hover:border-b-[#2F6B3F]'
                      }`}
                      onMouseEnter={() => setShowMegaMenu(true)}
                      onMouseLeave={() => setShowMegaMenu(false)}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </Link>

                    {showMegaMenu && (
                      <div
                        onMouseEnter={() => setShowMegaMenu(true)}
                        onMouseLeave={() => setShowMegaMenu(false)}
                        className="absolute left-0 top-full bg-white rounded-2xl shadow-2xl border border-[#E6E1D8] z-50 animate-in fade-in duration-300 w-[90vw] max-w-162 lg:w-130"
                      >
                        <div className="grid grid-cols-2 gap-6 p-6">
                          <div>
                            <h3 className="font-bold text-xs mb-3 tracking-widest text-[#2F6B3F]">
                              SHOP BY CATEGORY
                            </h3>
                            <div className="space-y-2">
                              {megaMenuCategories.map((cat) => (
                                <Link
                                  key={cat}
                                  href={`/collection?category=${cat}`}
                                  className="block text-sm font-medium text-[#3A3A3A] hover:text-[#2F6B3F] transition-colors hover:pl-1 py-1"
                                  onClick={() => setShowMegaMenu(false)}
                                >
                                  {cat}
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-xs mb-3 tracking-widest text-[#2F6B3F]">
                              DISCOVER
                            </h3>
                            <div className="space-y-2">
                              {megaMenuDiscover.map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.path}
                                  className="block text-sm font-medium text-[#3A3A3A] hover:text-[#2F6B3F] transition-colors hover:pl-1 py-1"
                                  onClick={() => setShowMegaMenu(false)}
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.path}
                    className={`py-2 px-1 text-sm font-medium transition-all duration-300 border-b-2 ${
                      pathname === link.path
                        ? 'text-[#2F6B3F] border-b-[#2F6B3F]'
                        : 'text-[#3A3A3A] border-b-transparent hover:text-[#2F6B3F] hover:border-b-[#2F6B3F]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowSidebar(false)}>
        <div
          ref={sidebarRef}
          className={`fixed left-0 top-0 h-screen w-[85vw] max-w-sm bg-white shadow-2xl overflow-y-auto transition-transform duration-400 ease-out z-50 flex flex-col ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-[#E6E1D8] px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2F6B3F]">Menu</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-[#F8F6F2] transition-colors"
            >
              <X className="w-6 h-6 text-[#5B4636]" strokeWidth={2} />
            </button>
          </div>

          {isLoggedIn && (
            <div className="px-5 sm:px-6 py-4 sm:py-5 bg-[#F8F6F2] border-b border-[#E6E1D8]">
              <p className="text-xs font-bold text-[#8A6F55] uppercase tracking-wide mb-2">Account</p>
              <p className="text-base font-bold text-[#2F6B3F] truncate">{userEmail}</p>
            </div>
          )}

          <nav className="py-4 space-y-1 flex-1">
            <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Shop</div>
            <button
              onClick={() => {
                router.push('/');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                router.push('/collection');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <Store className="w-5 h-5" />
              <span>Shop</span>
            </button>

            <div className="border-t border-gray-200 my-2" />
            <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">My Account</div>
            
            <button
              onClick={() => {
                router.push('/orders');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <Package className="w-5 h-5" />
              <span>My Orders</span>
            </button>
            <button
              onClick={() => {
                router.push('/wishlist');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </button>
            <button
              onClick={() => {
                router.push('/notifications');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => {
                router.push('/profile');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <User className="w-5 h-5" />
              <span>My Profile</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => {
                  logout();
                  setShowSidebar(false);
                  router.push('/login');
                }}
                className="flex items-center gap-4 w-full px-5 py-3 text-sm font-semibold text-[#D6524A] hover:bg-gray-100/40 transition-colors text-left"
              >
                <LogOut className="w-5 h-5" strokeWidth={2} />
                <span>Logout</span>
              </button>
            )}
            {!isLoggedIn && (
              <button
                onClick={() => {
                  router.push('/login');
                  setShowSidebar(false);
                }}
                className="flex items-center gap-4 w-full px-5 py-3 text-sm font-semibold text-[#2F6B3F] hover:bg-gray-100/40 transition-colors text-left"
              >
                <LogIn className="w-5 h-5" strokeWidth={2} />
                <span>Sign In</span>
              </button>
            )}

            <div className="border-t border-gray-200 my-2" />
            <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Support</div>
            <button
              onClick={() => {
                router.push('/help-support');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help & Support</span>
            </button>
            <button
              onClick={() => {
                router.push('/contact');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <Phone className="w-5 h-5" />
              <span>Contact</span>
            </button>

            <div className="border-t border-gray-200 my-2" />
            <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Legal</div>
            <button
              onClick={() => {
                router.push('/privacy');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <Lock className="w-5 h-5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => {
                router.push('/terms');
                setShowSidebar(false);
              }}
              className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-[#3A3A3A] hover:bg-gray-100/40 transition-colors text-left"
            >
              <FileText className="w-5 h-5" />
              <span>Terms & Conditions</span>
            </button>
          </nav>

          <div className="px-5 py-5 bg-white border-t border-[#E6E1D8] space-y-2">
            <p className="font-bold text-base text-[#2F6B3F]">Green Valley Naturals</p>
            <p className="text-sm text-[#8A6F55]">100% Organic & Fresh</p>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileSearch && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/20"
            onClick={() => setShowMobileSearch(false)}
          />
          <div 
            className="md:hidden fixed left-0 right-0 z-50 bg-white shadow-lg border-b border-[#E6E1D8] animate-in slide-in-from-top duration-300"
          >
            <div className="relative flex items-center gap-2 p-3">
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-[#F8F6F2] rounded-lg transition-all shrink-0"
              >
                <X className="w-6 h-6 text-[#5B4636]" strokeWidth={2} />
              </button>
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={handleSearch}
                autoFocus
                className="flex-1 px-4 py-3 rounded-lg text-base focus:outline-none bg-[#F8F6F2] border border-[#E6E1D8] text-[#3A3A3A]"
              />
            </div>

            {showSearchDropdown && searchInput.length >= 2 && (
              <div className="bg-white max-h-[calc(100vh-150px)] overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <div>
                    <div className="px-4 py-3 bg-linear-to-r from-[#F8F6F2] to-white border-t border-gray-100 sticky top-0">
                      <p className="text-xs font-semibold text-[#5B4636] uppercase tracking-wide">
                        Results ({filteredProducts.length})
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {filteredProducts.slice(0, 10).map((product) => (
                        <button
                          key={product._id}
                          onClick={() => {
                            setShowMobileSearch(false);
                            setShowSearchDropdown(false);
                            setSearchInput('');
                            setTimeout(() => {
                              router.push(`/product/${product._id}`);
                            }, 100);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-4 hover:bg-[#F8F6F2] cursor-pointer transition-colors text-left bg-white text-sm"
                        >
                          <div className="k-0">
                            {getProductImage(product) ? (
                              <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="w-14 h-14 object-cover rounded border border-gray-200 bg-white p-0.5"
                                onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                              />
                            ) : (
                              <div className="w-14 h-14 bg-[#F8F6F2] rounded border border-gray-200 flex items-center justify-center">
                                <Search className="w-6 h-6 text-[#8A6F55]" strokeWidth={1.5} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-base text-[#2F6B3F] font-bold">₹{getProductPrice(product)}</p>
                              {product.variants && product.variants[0]?.originalPrice > getProductPrice(product) && (
                                <>
                                  <span className="text-xs line-through text-gray-400">
                                    ₹{product.variants[0].originalPrice}
                                  </span>
                                  <span className="text-xs font-bold text-red-600">
                                    {Math.round(((product.variants[0].originalPrice - getProductPrice(product)) / product.variants[0].originalPrice) * 100)}% off
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {filteredProducts.length > 10 && (
                      <button
                        onClick={() => {
                          setShowMobileSearch(false);
                          setShowSearchDropdown(false);
                          setTimeout(() => {
                            router.push(`/collection?search=${searchInput}`);
                            setSearchInput('');
                          }, 100);
                        }}
                        className="w-full px-4 py-4 text-center text-base font-semibold text-[#2F6B3F] bg-[#F8F6F2] hover:bg-[#F0EDE8] border-t border-gray-100 transition-colors"
                      >
                        View all {filteredProducts.length} results
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
                    <p className="text-base text-[#8A6F55] font-medium">No products found</p>
                    <p className="text-sm text-[#AAA] mt-1">Try different keywords</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
