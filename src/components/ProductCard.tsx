import { Link } from 'react-router-dom';
import { Heart, MapPin, Eye, Star } from 'lucide-react';
import { formatKES, timeAgo, conditionLabel, conditionColor } from '../lib/utils';
import { toggleFavourite, useStore } from '../lib/store';
import type { Listing } from '../lib/types';

interface ProductCardProps {
  listing: Listing;
  compact?: boolean;
}

export default function ProductCard({ listing, compact }: ProductCardProps) {
  const { favourites } = useStore();
  const isFav = favourites.includes(listing.id);

  return (
    <div className="bg-white dark:bg-[#0f2018] rounded-2xl overflow-hidden shadow-sm border border-[#d1e8d9] dark:border-[#1a3528] hover:shadow-md hover:-translate-y-0.5 transition-all group">
      <Link to={`/listings/${listing.id}`} className="block">
        {/* Image */}
        <div className={`relative overflow-hidden bg-[#e8f5ed] ${compact ? 'h-36' : 'h-44'}`}>
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Status badge */}
          {listing.status !== 'live' && (
            <div className="absolute top-2 left-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full status-${listing.status}`}>
                {listing.status.toUpperCase()}
              </span>
            </div>
          )}
          {/* Condition badge */}
          <div className="absolute bottom-2 left-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${conditionColor(listing.condition)}`}>
              {conditionLabel(listing.condition)}
            </span>
          </div>
          {listing.negotiable && (
            <div className="absolute bottom-2 right-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e]">
                Nego.
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link to={`/listings/${listing.id}`} className="block">
          <p className={`font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] leading-tight line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {listing.title}
          </p>
          <div className="flex items-center justify-between mt-1.5">
            <span className={`font-['Poppins'] font-bold text-[#1a7a42] ${compact ? 'text-sm' : 'text-base'}`}>
              {formatKES(listing.price)}
            </span>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-[#4a6957] dark:text-[#85a88e]">
            <MapPin size={10} className="shrink-0" />
            <span className="text-[10px] truncate max-w-[80px]">{listing.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo(listing.createdAt)}</span>
            <button
              onClick={(e) => { e.preventDefault(); toggleFavourite(listing.id); }}
              className="p-1 rounded-full hover:bg-red-50 transition-colors"
              aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart
                size={14}
                className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 dark:text-gray-600'}
              />
            </button>
          </div>
        </div>

        {!compact && (
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#e8f5ed] dark:border-[#1a3528]">
            <div className="flex items-center gap-1">
              <img
                src={listing.seller.avatarUrl || `https://ui-avatars.com/api/?name=${listing.seller.name}&background=1a7a42&color=fff&size=20`}
                alt={listing.seller.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[60px]">{listing.seller.name.split(' ')[0]}</span>
              {listing.seller.isTrustedSeller && (
                <Star size={9} className="text-[#f59e0b] fill-[#f59e0b]" />
              )}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Eye size={10} className="text-gray-400" />
              <span className="text-[10px] text-gray-400">{listing.views}</span>
              <Heart size={10} className="text-gray-400 ml-1" />
              <span className="text-[10px] text-gray-400">{listing.favourites}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
