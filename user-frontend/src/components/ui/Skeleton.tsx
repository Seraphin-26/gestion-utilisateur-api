import React from 'react'

interface SkeletonProps { className?: string }

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  )
}
