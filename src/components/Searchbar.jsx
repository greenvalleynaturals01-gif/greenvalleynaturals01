'use client';

import React, { useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShopContext } from '../context/ShopContext';
import { Search, X } from 'lucide-react';

const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pathname]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center" style={{ marginTop: '20px' }}>
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        <Search className="w-4 h-4" style={{ color: '#666' }} />
      </div>
      <button
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
      >
        <X className="w-4 h-4" style={{ color: '#666' }} />
      </button>
    </div>
  ) : null;
};

export default Searchbar;
