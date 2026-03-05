'use client';

import React, { useState, useEffect } from 'react';
import { Button, Badge, Input, Textarea, Select } from '@/components/ui';
import { Modal } from '@/components/ui';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firebase';
import { slugify, formatDate } from '@/lib/utils';
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

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

const CATEGORIES = ['Technology', 'Guides', 'News', 'Reviews', 'Tips & Tricks'];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Unlimited IT Solutions',
    category: 'Technology',
    tags: '',
    published: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const data = await getCollection('blog');
      const sorted = (data as unknown as BlogPost[]).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openEditor(post?: BlogPost) {
    if (post) {
      setEditingPost(post);
      setForm({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || '',
        author: post.author,
        category: post.category,
        tags: (post.tags || []).join(', '),
        published: post.published,
      });
    } else {
      setEditingPost(null);
      setForm({ title: '', excerpt: '', content: '', coverImage: '', author: 'Unlimited IT Solutions', category: 'Technology', tags: '', published: true });
    }
    setShowEditor(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const postData = {
      title: form.title.trim(),
      slug: slugify(form.title),
      excerpt: form.excerpt.trim() || form.content.substring(0, 200),
      content: form.content,
      coverImage: form.coverImage.trim() || null,
      author: form.author.trim(),
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      published: form.published,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingPost) {
        await updateDocument('blog', editingPost.id, postData);
        toast.success('Post updated');
      } else {
        await addDocument('blog', { ...postData, createdAt: new Date().toISOString() });
        toast.success('Post created');
      }
      setShowEditor(false);
      fetchPosts();
    } catch (err) {
      toast.error('Failed to save post');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteDocument('blog', id);
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Failed to delete post');
    }
  }

  async function togglePublished(post: BlogPost) {
    try {
      await updateDocument('blog', post.id, { published: !post.published, updatedAt: new Date().toISOString() });
      toast.success(post.published ? 'Post unpublished' : 'Post published');
      fetchPosts();
    } catch {
      toast.error('Failed to update post');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500">{posts.length} posts</p>
        </div>
        <Button onClick={() => openEditor()}>
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No blog posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  <Badge variant={post.published ? 'success' : 'warning'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                  <Badge variant="info">{post.category}</Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{post.excerpt}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(post.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button size="icon" variant="ghost" onClick={() => togglePublished(post)}>
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => openEditor(post)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Editor Modal */}
      <Modal isOpen={showEditor} onClose={() => setShowEditor(false)} title={editingPost ? 'Edit Post' : 'New Post'} size="xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tech, guide, review" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your post content (supports HTML)..."
              rows={12}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm text-gray-700">Publish immediately</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditor(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingPost ? 'Update' : 'Create'} Post</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
