import { Plus, RefreshCcw, Search, Upload } from 'lucide-react'

interface QuickActionsProps {
  onNew: () => void
  onRefresh: () => void
}

export default function QuickActions({ onNew, onRefresh }: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1224]/90 p-5 backdrop-blur-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">
        Quick actions
      </h3>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
        >
          <Plus className="h-4 w-4" /> New article
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#080d1a]/80 px-4 py-3 text-sm font-medium text-[#94A3B8] transition hover:border-[#2563EB]/30 hover:text-white"
        >
          <RefreshCcw className="h-4 w-4" /> Refresh data
        </button>
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/5 px-4 py-3 text-sm font-medium text-[#64748B] opacity-60 cursor-not-allowed"
          title="Bulk import coming soon"
        >
          <Upload className="h-4 w-4" /> Import draft
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-[#14B8A6] transition hover:bg-white/5"
        >
          <Search className="h-4 w-4" /> View site
        </a>
      </div>
    </div>
  )
}
