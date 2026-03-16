'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge, Skeleton } from '@/components/ui';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getCollection, where } from '@/lib/firebase';
import { formatDate } from '@/lib/utils';
import { Calendar, User, ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import type { QueryConstraint } from 'firebase/firestore';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getCollection('blog', [
          where('slug', '==', slug),
        ] as QueryConstraint[]);
        const posts = data as unknown as BlogPost[];
        if (posts.length > 0 && posts[0].published) {
          setPost(posts[0]);
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: 'Not Found' }]} />
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Post Not Found</h2>
          <p className="text-gray-500 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog"><Button>Back to Blog</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumbs items={[
        { label: 'Blog', href: '/blog' },
        { label: post.title },
      ]} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.category && <Badge>{post.category}</Badge>}
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="info">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://unlimitedits.co.za/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://unlimitedits.co.za/blog/${slug}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-500 transition-colors"
                aria-label="Share on X"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://unlimitedits.co.za/blog/${slug}`)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Share link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
