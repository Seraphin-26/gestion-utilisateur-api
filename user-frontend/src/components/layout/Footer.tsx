import React from 'react'
import { Zap, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto py-6 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center shadow-sm shadow-accent/30">
            <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>UserAPI</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span>Fait avec</span>
          <Heart className="w-3.5 h-3.5 text-danger fill-danger" />
          <span>par</span>
          <span className="font-display font-semibold text-accent">NARIVELOSON Seraphin</span>
        </div>

        <div className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} · All rights reserved
        </div>

      </div>
    </footer>
  )
}