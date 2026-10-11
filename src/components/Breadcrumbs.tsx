import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Filter out redundant initial 'Home' if passed by page
  const displayItems = items.filter((item, index) => !(index === 0 && item.name.toLowerCase() === 'home'));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#666] py-3 mb-6 overflow-x-auto">
      <ol className="flex items-center space-x-2 shrink-0">
        <li>
          <Link href="/" className="hover:text-[#0F1E4A] text-[#666] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-[#0F1E4A]" />
            <span>Home</span>
          </Link>
        </li>

        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="w-3 h-3 text-[#A0AEC0]" />
              {isLast || !item.url ? (
                <span className="text-[#0F1E4A] font-semibold truncate max-w-xs" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="text-[#666] hover:text-[#0F1E4A] transition-colors truncate max-w-xs">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
