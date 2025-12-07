'use client';

import { useEffect, useState } from 'react';

export default function AdDisplay({ placement }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const url = placement ? `/api/ads/public?placement=${placement}` : '/api/ads/public';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.data) {
          setAd(data.data);

          // Track View
          fetch(`/api/ads/track/${data.data._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'view' })
          });
        }
      } catch (error) {
        console.error('Failed to fetch ad', error);
      }
    };

    fetchAd();
  }, [placement]);

  if (!ad) return null;

  const handleAdClick = () => {
    if (ad.type === 'local') {
      fetch(`/api/ads/track/${ad._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'click' })
      });
    }
  };

  return (
    <div className="w-full my-6 flex justify-center">
      {ad.type === 'local' ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={handleAdClick} className="block transition-transform hover:scale-[1.02]">
          <img src={ad.imageUrl} alt={ad.title} className="max-w-full h-auto rounded-lg shadow-md" style={{ maxHeight: '250px' }} />
          <div className="text-xs text-gray-400 text-right mt-1">Advertisement</div>
        </a>
      ) : (
        <div className="w-full text-center">
          <div dangerouslySetInnerHTML={{ __html: ad.adCode }} />
          <div className="text-xs text-gray-400 text-right mt-1">Advertisement</div>
        </div>
      )}
    </div>
  );
}
