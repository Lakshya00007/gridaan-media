import { Plus, RefreshCcw, Search, Upload } from 'lucide-react'

interface QuickActionsProps {
  onNew: () => void
  onRefresh: () => void
}

export default function QuickActions({ onNew, onRefresh }: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
        Quick actions
      </h3>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Plus className="h-4 w-4" aria-hidden /> New article
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-[#fafaf9] px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-[#f5f5f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden /> Refresh data
        </button>
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/5 px-4 py-3 text-sm font-medium text-[#64748B] opacity-60 cursor-not-allowed"
          title="Bulk import coming soon"
        >
          <Upload className="h-4 w-4" aria-hidden /> Import draft
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-primary transition hover:bg-[#f5f5f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Search className="h-4 w-4" aria-hidden /> View site
        </a>
      </div>
    </div>
  )
}
