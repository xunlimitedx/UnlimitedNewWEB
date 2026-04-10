'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCollection } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import { Search, X, Loader2, Package, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';
import type { Product } from '@/types';

export default function InstantSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [fuse, setFuse] = useState<Fuse<Product> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load products on first focus
  const loadProducts = useCallback(async () => {
    if (products.length > 0) return;
    setLoading(true);
    try {
      const data = await getCollection('products', []);
      const active = (data as unknown as Product[]).filter((p) => p.isActive !== false && (p as any).active !== false);
      setProducts(active);
      const f = new Fuse(active, {
        keys: [
          { name: 'name', weight: 0.4 },
          { name: 'brand', weight: 0.2 },
          { name: 'category', weight: 0.2 },
          { name: 'tags', weight: 0.1 },
          { name: 'sku', weight: 0.1 },
        ],
        threshold: 0.4,
        includeScore: true,
      });
      setFuse(f);
    } finally {
      setLoading(false);
    }
  }, [products.length]);

  // Search when query changes
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }
    const searchResults = fuse.search(query.trim()).slice(0, 6);
    setResults(searchResults.map((r) => r.item));
  }, [query, fuse]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => { loadProducts(); setIsOpen(true); }}
          placeholder="Search products..."
          className="w-full h-10 pl-10 pr-10 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => { setIsOpen(false); setQuery(''); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category} {product.brand ? `· ${product.brand}` : ''}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                    {formatCurrency(product.price)}
                  </span>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-primary-600 font-medium hover:bg-primary-50 border-t"
              >
                View all results for &ldquo;{query}&rdquo; <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
