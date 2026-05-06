'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { getCollection, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase';
import { Plus, Trash2, Save, Eye, EyeOff, ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface BAItem {
  id: string;
  before: string;
  after: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
}

const SUGGESTED_PAIRS = [
  {
    label: 'Cracked MacBook screen → repaired',
    before: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=600&fit=crop',
  },
  {
    label: 'Liquid damaged laptop → restored',
    before: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=600&fit=crop',
  },
  {
    label: 'Faulty console → fixed',
    before: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=600&fit=crop',
  },
];

const empty = (order: number): Omit<BAItem, 'id'> => ({
  before: '',
  after: '',
  title: '',
  description: '',
  order,
  active: true,
});

export default function AdminBeforeAfterPage() {
  const [items, setItems] = useState<BAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Omit<BAItem, 'id'>>(empty(0));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCollection('beforeAfter', [orderBy('order', 'asc')]);
      setItems(data as unknown as BAItem[]);
    } catch (e) {
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (item: BAItem) => {
    setEditingId(item.id);
    setDraft({
      before: item.before,
      after: item.after,
      title: item.title,
      description: item.description,
      order: item.order ?? 0,
      active: item.active !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(empty(items.length));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.before || !draft.after || !draft.title) {
      toast.error('Title, before image and after image are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateDocument('beforeAfter', editingId, { ...draft, updatedAt: new Date().toISOString() });
        toast.success('Item updated');
      } else {
        await addDocument('beforeAfter', {
          ...draft,
          order: draft.order ?? items.length,
          createdAt: new Date().toISOString(),
        });
        toast.success('Item added');
      }
      setEditingId(null);
      setDraft(empty(items.length + 1));
      await load();
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      await deleteDocument('beforeAfter', id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (item: BAItem) => {
    try {
      await updateDocument('beforeAfter', item.id, { active: !(item.active !== false) });
      await load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const move = async (item: BAItem, dir: -1 | 1) => {
    const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sorted.findIndex((i) => i.id === item.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    try {
      await Promise.all([
        updateDocument('beforeAfter', item.id, { order: swap.order ?? 0 }),
        updateDocument('beforeAfter', swap.id, { order: item.order ?? 0 }),
      ]);
      await load();
    } catch {
      toast.error('Failed to reorder');
    }
  };

  const usePreset = (preset: (typeof SUGGESTED_PAIRS)[0]) => {
    setDraft((d) => ({ ...d, before: preset.before, after: preset.after }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Before &amp; After Gallery</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage the homepage repair showcase. Paste image URLs (Firebase Storage, Imgur, Unsplash, etc.) and add a short caption.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="card-premium p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            {editingId ? 'Edit item' : 'Add new item'}
          </h2>
          {editingId && (
            <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>Cancel edit</Button>
          )}
        </div>

        {/* Suggested pairs */}
        <div className="rounded-xl bg-gradient-to-br from-primary-50/60 to-blue-50/60 dark:from-primary-900/20 dark:to-blue-900/20 ring-1 ring-primary-500/15 p-4">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary-700 dark:text-primary-300 mb-3">Quick presets — click to fill image fields</p>
          <div className="grid sm:grid-cols-3 gap-2">
            {SUGGESTED_PAIRS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => usePreset(p)}
                className="text-left p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 transition-colors text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Before image URL <span className="text-red-500">*</span>
            </label>
            <Input
              type="url"
              placeholder="https://..."
              value={draft.before}
              onChange={(e) => setDraft({ ...draft, before: e.target.value })}
              required
            />
            {draft.before && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.before} alt="Before preview" className="mt-3 rounded-lg w-full h-40 object-cover ring-1 ring-gray-200 dark:ring-gray-700" />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              After image URL <span className="text-red-500">*</span>
            </label>
            <Input
              type="url"
              placeholder="https://..."
              value={draft.after}
              onChange={(e) => setDraft({ ...draft, after: e.target.value })}
              required
            />
            {draft.after && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.after} alt="After preview" className="mt-3 rounded-lg w-full h-40 object-cover ring-1 ring-gray-200 dark:ring-gray-700" />
            )}
          </div>
        </div>

        <Input
          label="Title *"
          placeholder="e.g. MacBook Pro Screen Replacement"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          required
        />

        <Textarea
          label="Description"
          placeholder="Short caption shown under the slider"
          rows={2}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />

        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            label="Display order"
            type="number"
            value={String(draft.order)}
            onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) || 0 })}
          />
          <label className="flex items-center gap-3 mt-7">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visible on homepage</span>
          </label>
        </div>

        <Button type="submit" loading={saving}>
          <Save className="w-4 h-4" /> {editingId ? 'Update item' : 'Add item'}
        </Button>
      </form>

      {/* List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          Current items ({items.length})
        </h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="card-premium text-center py-12 px-6">
            <ImageIcon className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No items yet. The homepage will show the built-in defaults until you add some.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.id} className="card-premium p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex gap-2 sm:w-56 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.before} alt="Before" className="w-1/2 h-24 object-cover rounded-lg ring-1 ring-gray-200 dark:ring-gray-700" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.after} alt="After" className="w-1/2 h-24 object-cover rounded-lg ring-1 ring-emerald-500/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white tracking-tight truncate">{item.title}</h3>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${item.active !== false ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.active !== false ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {item.active !== false ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{item.description || <em>No description</em>}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(item)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(item)}>
                        {item.active !== false ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
                      </Button>
                      <Button size="sm" variant="outline" disabled={idx === 0} onClick={() => move(item, -1)}>
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" disabled={idx === items.length - 1} onClick={() => move(item, 1)}>
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="!text-red-600 !border-red-200 hover:!bg-red-50 dark:!border-red-900/40 dark:hover:!bg-red-900/20">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
