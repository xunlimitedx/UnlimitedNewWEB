'use client';

import { useEffect, useState } from 'react';

interface SocialPost {
  platform: 'facebook';
  text: string;
  date: string;
  likes: number;
  link: string;
}

const RECENT_POSTS: SocialPost[] = [
  {
    platform: 'facebook',
    text: '🔧 Another MacBook Pro saved! Customer shipped it in from Johannesburg — motherboard repair complete and on its way back. #MailInRepairs',
    date: '2 days ago',
    likes: 24,
    link: 'https://www.facebook.com/unlimiteditsolutions',
  },
  {
    platform: 'facebook',
    text: '🎉 New stock alert! Dell Latitude and HP ProBook laptops now available. Perfect for business and students. Visit us or order online!',
    date: '5 days ago',
    likes: 18,
    link: 'https://www.facebook.com/unlimiteditsolutions',
  },
  {
    platform: 'facebook',
    text: '📹 Just installed a 16-camera CCTV system for a local business in Port Shepstone. Remote viewing set up on their phones. Stay safe, South Coast!',
    date: '1 week ago',
    likes: 31,
    link: 'https://www.facebook.com/unlimiteditsolutions',
  },
];

export default function SocialFeed() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid md:grid-cols-3 gap-6">
        {RECENT_POSTS.map((post, i) => (
          <a
            key={i}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Unlimited IT Solutions</p>
                <p className="text-xs text-gray-400">{post.date}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
              {post.text}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>👍 {post.likes}</span>
              <span className="group-hover:text-primary-600 transition-colors">View on Facebook →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
