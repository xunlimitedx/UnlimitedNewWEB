'use client';

import React, { useState, useCallback } from 'react';
import { Button, Card, CardContent } from '@/components/ui';
import { addDocument } from '@/lib/firebase';
import {
  Upload,
  FileSpreadsheet,
  FileJson,
  FileCode,
  Globe,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

type ImportFormat = 'csv' | 'json' | 'xml' | 'url';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export default function AdminImportPage() {
  const [format, setFormat] = useState<ImportFormat>('csv');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [url, setUrl] = useState('');

  const formats = [
    { id: 'csv' as const, label: 'CSV', icon: FileSpreadsheet, desc: 'Upload a CSV file with product data' },
    { id: 'json' as const, label: 'JSON', icon: FileJson, desc: 'Upload a JSON array of products' },
    { id: 'xml' as const, label: 'XML', icon: FileCode, desc: 'Upload an XML file with product nodes' },
    { id: 'url' as const, label: 'URL Scrape', icon: Globe, desc: 'Scrape product data from a URL' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFileContent(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] || '';
      });
      return obj;
    });
  };

  const parseJSON = (text: string): any[] => {
    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [data];
    } catch {
      return [];
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setResult(null);
    const importResult: ImportResult = { total: 0, success: 0, failed: 0, errors: [] };

    try {
      let products: any[] = [];

      if (format === 'csv') {
        products = parseCSV(fileContent);
      } else if (format === 'json') {
        products = parseJSON(fileContent);
      } else if (format === 'xml') {
        // Simple XML parsing via API
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'xml', content: fileContent }),
        });
        const data = await response.json();
        products = data.products || [];
      } else if (format === 'url') {
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'url', url }),
        });
        const data = await response.json();
        products = data.products || [];
      }

      importResult.total = products.length;

      for (const product of products) {
        try {
          await addDocument('products', {
            name: product.name || product.title || 'Untitled Product',
            description: product.description || '',
            shortDescription: product.shortDescription || product.short_description || '',
            price: parseFloat(product.price) || 0,
            salePrice: product.salePrice ? parseFloat(product.salePrice) : null,
            category: product.category || 'uncategorized',
            brand: product.brand || '',
            sku: product.sku || '',
            stock: product.stock ? parseInt(product.stock) : null,
            images: product.images
              ? Array.isArray(product.images)
                ? product.images
                : [product.images]
              : [],
            tags: product.tags
              ? Array.isArray(product.tags)
                ? product.tags
                : product.tags.split(',').map((t: string) => t.trim())
              : [],
            specifications: product.specifications || {},
            isActive: true,
            isFeatured: false,
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          importResult.success++;
        } catch (err) {
          importResult.failed++;
          importResult.errors.push(
            `Failed: ${product.name || 'unknown'} – ${(err as Error).message}`
          );
        }
      }

      setResult(importResult);
      if (importResult.success > 0) {
        toast.success(`Imported ${importResult.success} products!`);
      }
      if (importResult.failed > 0) {
        toast.error(`${importResult.failed} products failed`);
      }
    } catch (err) {
      toast.error('Import failed: ' + (err as Error).message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Data Import
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Import products from CSV, JSON, XML files or scrape from a URL
        </p>
      </div>

      {/* Format Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFormat(f.id);
              setResult(null);
              setFileContent('');
            }}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              format === f.id
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <f.icon className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {format === 'url' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Page URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/products"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter a URL to scrape product data from. Works best with
                structured product pages.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload {format.toUpperCase()} File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  accept={
                    format === 'csv'
                      ? '.csv'
                      : format === 'json'
                      ? '.json'
                      : '.xml'
                  }
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format.toUpperCase()} files only
                  </p>
                </label>
              </div>
              {fileContent && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  File loaded ({fileContent.length.toLocaleString()} bytes)
                </div>
              )}

              {format === 'csv' && (
                <div className="mt-3 text-xs text-gray-500">
                  <p className="font-medium mb-1">Expected CSV headers:</p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    name,description,price,salePrice,category,brand,sku,stock,images,tags
                  </code>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Button */}
      <Button
        onClick={handleImport}
        loading={importing}
        disabled={format === 'url' ? !url : !fileContent}
        className="w-full"
        size="lg"
      >
        <Upload className="w-4 h-4" />
        {importing ? 'Importing...' : 'Start Import'}
      </Button>

      {/* Results */}
      {result && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Import Results</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {result.total}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {result.success}
                </p>
                <p className="text-xs text-green-600">Success</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {result.failed}
                </p>
                <p className="text-xs text-red-600">Failed</p>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-700 mb-2">Errors:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {result.errors.map((err, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
