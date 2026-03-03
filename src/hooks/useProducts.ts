'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCollection,
  getDocument,
  where,
} from '@/lib/firebase';
import type { Product } from '@/types';
import { QueryConstraint } from 'firebase/firestore';

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest';
  pageSize?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const constraints: QueryConstraint[] = [];

      if (options.category) {
        constraints.push(where('category', '==', options.category));
      }

      const data = await getCollection('products', constraints);
      // Filter client-side to handle both isActive and active field names
      let result = (data as unknown as Product[]).filter(
        (p) => p.isActive !== false && p.active !== false
      );

      if (options.featured) {
        result = result.filter((p) => p.isFeatured === true || p.featured === true);
      }

      // Sort
      if (options.sortBy) {
        switch (options.sortBy) {
          case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'newest':
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }

      if (options.pageSize) {
        result = result.slice(0, options.pageSize);
      }

      // Client-side search filter
      if (options.searchQuery) {
        const q = options.searchQuery.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.brand || '').toLowerCase().includes(q) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      }

      setProducts(result);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.featured, options.searchQuery, options.sortBy, options.pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getDocument('products', productId);
        setProduct(data as unknown as Product | null);
        setError(null);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
}
