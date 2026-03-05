import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', 'metadata.google.internal'];

function isUrlSafe(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    if (BLOCKED_HOSTNAMES.includes(url.hostname)) return false;
    // Block private IPs
    if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(url.hostname)) return false;
    if (url.hostname.endsWith('.internal') || url.hostname.endsWith('.local')) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === 'url') {
      // URL Scraping
      const { url } = body;
      if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
      }

      if (!isUrlSafe(url)) {
        return NextResponse.json({ error: 'URL is not allowed. Only public HTTPS/HTTP URLs are permitted.' }, { status: 400 });
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.status}` },
          { status: 400 }
        );
      }

      const html = await response.text();

      // Dynamic imports for server-side parsing
      const cheerio = await import('cheerio');
      const $ = cheerio.load(html);

      // Try to extract product data from common patterns
      const products: any[] = [];

      // Try JSON-LD structured data first
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const data = JSON.parse($(el).html() || '');
          if (data['@type'] === 'Product') {
            products.push({
              name: data.name,
              description: data.description,
              price: data.offers?.price || data.offers?.[0]?.price,
              images: data.image
                ? Array.isArray(data.image)
                  ? data.image
                  : [data.image]
                : [],
              brand: data.brand?.name || '',
              sku: data.sku || '',
            });
          } else if (
            data['@type'] === 'ItemList' ||
            Array.isArray(data)
          ) {
            const items = Array.isArray(data)
              ? data
              : data.itemListElement || [];
            items.forEach((item: any) => {
              const product = item.item || item;
              if (product.name) {
                products.push({
                  name: product.name,
                  description: product.description || '',
                  price: product.offers?.price || '',
                  images: product.image ? [product.image] : [],
                });
              }
            });
          }
        } catch {
          // Ignore parsing errors for individual script tags
        }
      });

      // Fallback: try to extract from common HTML patterns
      if (products.length === 0) {
        const selectors = [
          '.product',
          '.product-card',
          '.product-item',
          '[data-product]',
          '.woocommerce-loop-product',
          '.grid-item',
        ];

        for (const selector of selectors) {
          $(selector).each((_, el) => {
            const $el = $(el);
            const name =
              $el.find('.product-title, .product-name, h2, h3, .title').first().text().trim() ||
              $el.find('a').first().text().trim();
            const price =
              $el.find('.price, .product-price, .amount').first().text().trim();
            const image =
              $el.find('img').first().attr('src') || '';
            const description =
              $el.find('.description, .product-description, p').first().text().trim();

            if (name) {
              products.push({
                name,
                description,
                price: price.replace(/[^0-9.]/g, ''),
                images: image ? [image] : [],
              });
            }
          });

          if (products.length > 0) break;
        }
      }

      return NextResponse.json({ products, count: products.length });
    }

    if (body.type === 'xml') {
      // XML Parsing
      const { content } = body;
      if (!content) {
        return NextResponse.json(
          { error: 'XML content is required' },
          { status: 400 }
        );
      }

      const { XMLParser } = await import('fast-xml-parser');
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
      });
      const result = parser.parse(content);

      // Try to find products in common XML structures
      const products: any[] = [];
      const findProducts = (obj: any, depth = 0): void => {
        if (depth > 5) return;
        if (Array.isArray(obj)) {
          obj.forEach((item) => {
            if (item.name || item.title) {
              products.push({
                name: item.name || item.title,
                description: item.description || '',
                price: item.price || '',
                category: item.category || '',
                sku: item.sku || item.id || '',
                images: item.image
                  ? Array.isArray(item.image)
                    ? item.image
                    : [item.image]
                  : [],
              });
            }
          });
        } else if (typeof obj === 'object' && obj !== null) {
          Object.values(obj).forEach((val) => findProducts(val, depth + 1));
        }
      };

      findProducts(result);

      return NextResponse.json({ products, count: products.length });
    }

    return NextResponse.json(
      { error: 'Invalid request type. Use "url" or "xml".' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Scraping failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
