import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[2.2rem] border border-[#d7e3ef] bg-white/85 p-8 text-center shadow-[0_18px_50px_rgba(65,101,138,0.08)]', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf4fb] text-[#17304d]">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-[#17304d]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#56718d]">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#6fa9ff] bg-white px-5 py-3 text-sm font-black text-[#2674ff] transition hover:bg-[#edf4fb]">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the master panel will appear here automatically. The page is ready to display them as soon as they arrive.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
