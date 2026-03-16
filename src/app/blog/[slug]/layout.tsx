import type { Metadata } from 'next';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
  initializeApp();
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const db = getFirestore();
    const snap = await db
      .collection('blog-posts')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0].data();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: 'Post Not Found' };

  const title = post.title || 'Blog Post';
  const description = post.excerpt || post.title || '';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Unlimited IT Solutions Blog`,
      description,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
      type: 'article',
      publishedTime: post.createdAt,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || post.title || '',
        url: `https://unlimitedits.co.za/blog/${slug}`,
        ...(post.coverImage ? { image: post.coverImage } : {}),
        datePublished: post.createdAt,
        ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
        author: {
          '@type': 'Person',
          name: post.author || 'Unlimited IT Solutions',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Unlimited IT Solutions',
          url: 'https://unlimitedits.co.za',
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
