'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCollection,
  getDocument,
  query,
  where,
  orderBy,
  limit,
  collection,
  db,
  getDocs,
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
      const constraints: QueryConstraint[] = [where('active', '==', true)];

      if (options.category) {
        constraints.push(where('category', '==', options.category));
      }

      if (options.featured) {
        constraints.push(where('featured', '==', true));
      }

      if (options.sortBy) {
        switch (options.sortBy) {
          case 'price-asc':
            constraints.push(orderBy('price', 'asc'));
            break;
          case 'price-desc':
            constraints.push(orderBy('price', 'desc'));
            break;
          case 'name':
            constraints.push(orderBy('name', 'asc'));
            break;
          case 'newest':
            constraints.push(orderBy('createdAt', 'desc'));
            break;
        }
      }

      if (options.pageSize) {
        constraints.push(limit(options.pageSize));
      }

      const data = await getCollection('products', constraints);
      let result = data as unknown as Product[];

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
