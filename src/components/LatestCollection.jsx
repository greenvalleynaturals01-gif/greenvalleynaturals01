'use client';

import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Subject from './Subject';
import Link from 'next/link';

const LatestCollection = () => {
    const {products, currency}=useContext(ShopContext);
    const [latestProducts,setLatestProducts]=useState([]);
    
    // Helper function to get product price
    const getProductPrice = (product) => {
      if (product.variants && product.variants.length > 0) {
        return Number(product.variants[0].sellingPrice) || 0;
      }
      return 0;
    };

    useEffect(() => {
      setLatestProducts(products.slice(0, 10));
    }, [products]);
  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
          <Subject text1={'LATEST'} text2={'COLLECTIONS'} />
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta ad pariatur dolores ea voluptas placeat nulla eum repudiandae deserunt libero.
            </p>
        </div>
        {/* Rendering products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
            latestProducts.map((item,index)=>{
              const productId = item._id;
              const imgUrl = Array.isArray(item.images) 
                ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url) 
                : (typeof item.images === 'string' ? item.images : item.images?.url) || item.image;
              const isOutOfStock = item.variants && item.variants.every(variant => (variant.stockQty || 0) === 0);
              
              return (
                <Link key={index} className='text-gray-700 cursor-pointer' href={`/product/${productId}`}>
                  <div className='relative overflow-hidden group'>
                    <img
                      className='hover:scale-110 transition ease-in-out'
                      src={imgUrl || 'https://via.placeholder.com/400?text=No+Image'}
                      alt={item.name}
                      style={{
                        filter: isOutOfStock ? 'grayscale(100%)' : 'grayscale(0%)',
                        opacity: isOutOfStock ? 0.85 : 1
                      }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=No+Image'}
                    />
                    {isOutOfStock && (
                      <div
                        className='absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white'
                        style={{ backgroundColor: '#666' }}
                      >
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <p className='pt-3 pb-1 text-sm'>{item.name}</p>
                  <p className='text-sm font-medium'>{currency}{getProductPrice(item)} </p>
                  <div className='flex items-center gap-2 mt-2'>
                    <div className='flex text-sm' style={{ color: '#2F6B3F' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(item.rating || 0) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className='text-xs text-gray-600'>({item.reviews || 0})</span>
                  </div>
                </Link>
              );
            })
        }
      </div>
    </div>
  )
}

export default LatestCollection
