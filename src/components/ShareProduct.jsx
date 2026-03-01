'use client';

import React, { useState, useEffect } from 'react';
import { Share2, X, Copy, MessageCircle, Users, Mail } from 'lucide-react';
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const ShareProduct = ({ product, productId, isOpen = false, onClose = null }) => {
  const [showShareModal, setShowShareModal] = useState(isOpen);
  const [copied, setCopied] = useState(false);
  const { success } = useContext(NotificationContext);

  // Handle external isOpen prop changes
  useEffect(() => {
    setShowShareModal(isOpen);
  }, [isOpen]);

  const closeModal = () => {
    setShowShareModal(false);
    if (onClose) onClose();
  };

  const productUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/product/${productId}`;
  const productName = product?.name || 'Check out this product';
  const shareMessage = `Check out "${productName}" on Green Valley!`;

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const text = encodeURIComponent(`${shareMessage}\n${productUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        closeModal();
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Users,
      action: () => {
        const text = encodeURIComponent(shareMessage);
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${text}`,
          '_blank',
          'width=600,height=400'
        );
        closeModal();
      }
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Share2,
      action: () => {
        const text = encodeURIComponent(`${shareMessage} ${productUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400');
        closeModal();
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(`Check out: ${productName}`);
        const body = encodeURIComponent(
          `Hi!\n\nI found this amazing product on Green Valley:\n\n${productName}\n\n${productUrl}\n\nCheck it out!`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`);
        closeModal();
      }
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(productUrl);
        setCopied(true);
        success('Product link copied!');
        setTimeout(() => {
          setCopied(false);
          closeModal();
        }, 1500);
      }
    }
  ];

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setShowShareModal(true)}
        className="px-5 py-3 rounded-lg border transition flex items-center gap-2"
        style={{
          borderColor: '#E6E1D8',
          backgroundColor: '#FFF',
          color: '#555'
        }}
        title="Share this product"
      >
        <Share2 className="w-5 h-5" style={{ color: '#2F6B3F' }} />
        <span className="hidden sm:inline font-medium text-sm" style={{ color: '#555' }}>Share</span>
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                Share Product
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X className="w-5 h-5" style={{ color: '#999' }} />
              </button>
            </div>

            {/* Share Options - Grid Layout */}
            <div className="grid grid-cols-5 gap-3 mb-5">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className="py-3 rounded-lg transition hover:bg-gray-50 flex flex-col items-center gap-2 border"
                    style={{
                      borderColor: '#E6E1D8',
                      backgroundColor: '#FFF'
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#2F6B3F' }} />
                    <span className="text-xs font-medium text-center" style={{ color: '#555' }}>
                      {option.id === 'copy' ? (copied ? 'Copied!' : option.name) : option.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="w-full py-2.5 rounded-lg font-medium transition"
              style={{
                backgroundColor: '#F5F5F5',
                color: '#666'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareProduct;
