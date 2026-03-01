'use client';

import React, { useState, useContext, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { MapPin, ChevronDown, Loader, AlertCircle, Navigation, X, CheckCircle } from 'lucide-react';
import { DeliveryContext } from '../context/DeliveryContext';
import { ShopContext } from '../context/ShopContext';

export default function DeliveryLocation() {
  const {
    deliveryPincode,
    deliveryCity,
    estimatedDelivery,
    codAvailable,
    isServiceable,
    loading,
    checkServiceability,
  } = useContext(DeliveryContext);

  const { backendUrl } = useContext(ShopContext);

  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showModal]);

  // Check pincode availability
  const handleCheckPincode = async () => {
    if (!inputValue || inputValue.length !== 6 || isNaN(inputValue)) {
      setError('Enter valid 6-digit pincode');
      return;
    }

    const result = await checkServiceability(inputValue);
    
    if (result.serviceable) {
      setShowModal(false);
      document.body.style.overflow = '';
      setInputValue('');
      setError('');
    } else {
      setError('Delivery not available at this pincode');
    }
  };

  // Get user's current location
  const handleUseCurrentLocation = async () => {
    setIsCheckingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      setIsCheckingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            const response = await fetch(
              `${backendUrl}/api/user/reverse-geocode?lat=${latitude}&lon=${longitude}`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('Backend API failed');
            
            const data = await response.json();
            
            const pincodeFromAPI = data.pincode || '';

            if (pincodeFromAPI && pincodeFromAPI.length === 6 && !isNaN(pincodeFromAPI)) {
              setInputValue(pincodeFromAPI);
              // Use a state callback approach
              setTimeout(() => {
                const pincode = pincodeFromAPI;
                // Directly call the checkServiceability with the pincode
                checkServiceability(pincode).then((result) => {
                  if (result.serviceable) {
                    setShowModal(false);
                    document.body.style.overflow = '';
                    setInputValue('');
                    setError('');
                  } else {
                    setError('Delivery not available at this pincode');
                  }
                }).catch((err) => {
                  console.error('Check error:', err);
                  setError('Error checking pincode');
                });
              }, 300);
            } else {
              console.log('Pincode not found in response:', data);
              setError('Pincode not available in your area. Please enter manually');
            }
          } catch (apiError) {
            clearTimeout(timeoutId);
            console.error('API Error:', apiError);
            // Fallback error message
            if (apiError.name === 'AbortError') {
              setError('Location lookup took too long. Please enter manually');
            } else {
              setError('Could not determine pincode. Please enter manually');
            }
          }
        } catch (err) {
          console.error('Location Error:', err);
          setError('Failed to process location');
        } finally {
          setIsCheckingLocation(false);
        }
      },
      (error) => {
        // Handle geolocation permission errors
        console.error('Geolocation Error:', error);
        if (error.code === 1) {
          setError('Location permission denied. Enable in browser settings');
        } else if (error.code === 2) {
          setError('Unable to retrieve your location');
        } else if (error.code === 3) {
          setError('Location request timed out');
        } else {
          setError('Enable location permission in browser');
        }
        setIsCheckingLocation(false);
      }
    );
  };

  const displayText = deliveryPincode ? `${deliveryPincode}` : 'Enter Pincode';
  const showDeliveryInfo = deliveryPincode && estimatedDelivery;

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
          setInputValue(deliveryPincode);
          setError('');
        }}
        className="flex items-center gap-1.5 sm:gap-2 text-white hover:text-white/95 transition-colors duration-200 cursor-pointer group text-xs sm:text-xs lg:text-xs font-medium"
        title="Change delivery location"
      >
        <MapPin className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-3.5 lg:h-3.5 flex-shrink-0" strokeWidth={2} />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-white/80 text-[9px] sm:text-[10px] lg:text-[10px] font-normal">Deliver to</span>
          <span className="truncate max-w-[80px] sm:max-w-[110px] lg:max-w-[110px] text-[10px] sm:text-xs lg:text-xs">{displayText}</span>
        </div>
        <ChevronDown className="w-3 h-3 flex-shrink-0 ml-0.5 sm:ml-auto lg:ml-auto" strokeWidth={2.5} />
      </button>

      {/* Delivery Info Badge - Removed */}

      {/* Modal - Rendered via Portal to escape overflow: hidden from parent */}
      {showModal && ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black/30 flex items-start sm:items-center justify-center z-[9999] p-4 pointer-events-auto pt-20 sm:pt-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              document.body.style.overflow = '';
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slideUp sm:animate-fadeIn max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Check Delivery</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  document.body.style.overflow = '';
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" strokeWidth={2} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Enter your pincode to check delivery availability and estimated delivery date
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setInputValue(value.slice(0, 6));
                  setError('');
                }}
                autoFocus
                placeholder="Enter 6-digit pincode"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3F] focus:border-transparent text-sm text-gray-900 placeholder-gray-400 font-medium"
                maxLength="6"
              />
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleCheckPincode}
                disabled={loading || !inputValue || inputValue.length !== 6}
                className="w-full bg-[#2F6B3F] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#225632] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Delivery'
                )}
              </button>

              <button
                onClick={handleUseCurrentLocation}
                disabled={isCheckingLocation || loading}
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-150 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isCheckingLocation ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" strokeWidth={2} />
                    Use Current Location
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
              We deliver to most pincodes across India. Estimated delivery in 3-5 business days.
            </p>
          </div>
        </div>
      , document.body)}

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
