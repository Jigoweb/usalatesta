import React from 'react';

export const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse" data-testid="article-skeleton">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-3">
          <div className="bg-primary-blue/20 h-6 w-20 rounded-full mr-2" />
          <div className="bg-slate-200 h-4 w-24 rounded" />
        </div>
        <div className="bg-slate-200 h-6 w-4/5 rounded mb-3" />
        <div className="space-y-2">
          <div className="bg-slate-200 h-4 w-full rounded" />
          <div className="bg-slate-200 h-4 w-5/6 rounded" />
        </div>
      </div>
    </div>
  );
};

export const HomeArticleSkeleton: React.FC = () => {
  return (
    <div className="min-w-[240px] w-[240px] bg-white rounded-xl overflow-hidden shadow-sm animate-pulse" data-testid="home-article-skeleton">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="p-3 space-y-2 mt-1">
        <div className="bg-slate-200 h-4 w-full rounded" />
        <div className="bg-slate-200 h-4 w-3/4 rounded" />
      </div>
    </div>
  );
};

export const ArticleDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-20 animate-pulse" data-testid="article-detail-skeleton">
      {/* Header Skeleton */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-50">
        <div className="w-6 h-6 bg-slate-200 rounded-full" />
      </div>

      {/* Hero Image Skeleton */}
      <div className="relative w-full aspect-[4/3] md:aspect-video bg-slate-200" />

      {/* Content Container Skeleton */}
      <div className="bg-white px-6 pt-10 min-h-screen">
        {/* Meta Tags */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-blue/20 h-7 w-24 rounded-full" />
          <div className="bg-slate-200 h-4 w-28 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-3 mb-8">
          <div className="h-8 bg-slate-200 rounded w-full" />
          <div className="h-8 bg-slate-200 rounded w-3/4" />
        </div>

        {/* Article Body */}
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-11/12" />
          <div className="h-4 bg-slate-200 rounded w-full mt-4" />
          <div className="h-4 bg-slate-200 rounded w-10/12" />
          <div className="h-4 bg-slate-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
};