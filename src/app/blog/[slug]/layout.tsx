import type { Metadata } from 'next';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
  initializeApp();
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const db = getFirestore();
    const snap = await db
      .collection('blog-posts')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get();

    if (snap.empty) {
      return { title: 'Post Not Found' };
    }

    const post = snap.docs[0].data();
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
  } catch {
    return { title: 'Blog Post' };
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
