'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { formatDate } from '@/lib/utils';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import BlogComments from '@/components/BlogComments';

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

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Hero with cover image */}
      <div className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        {post.coverImage && (
          <div className="absolute inset-0 opacity-30">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover blur-2xl scale-110"
              priority
            />
          </div>
        )}
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-blue-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {post.category && (
              <span className="eyebrow-chip">{post.category}</span>
            )}
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-slate-200">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-6 text-sm text-slate-300">
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
      </div>

      <Breadcrumbs items={[
        { label: 'Blog', href: '/blog' },
        { label: post.title },
      ]} />

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage || undefined,
            author: {
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Unlimited IT Solutions',
              url: 'https://unlimitedits.co.za',
            },
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt,
            mainEntityOfPage: `https://unlimitedits.co.za/blog/${post.slug}`,
          }),
        }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-10 -mt-24 shadow-2xl ring-1 ring-slate-200/60">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-img:rounded-xl prose-img:shadow-lg prose-code:text-primary-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Blog
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Share</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://unlimitedits.co.za/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://unlimitedits.co.za/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-sky-500 hover:text-white transition-colors"
                aria-label="Share on X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://unlimitedits.co.za/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-blue-700 hover:text-white transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-primary-600 hover:text-white transition-colors"
                aria-label="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <BlogComments postId={post.id} />
      </article>
    </div>
  );
}
