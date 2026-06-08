import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] px-4 py-14 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[1440px]">
          <div className="rounded-[2.5rem] border border-[#d7e3ef] bg-[linear-gradient(180deg,#ffffff_0%,#eef5fc_100%)] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9b0f06]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.07em] sm:text-6xl">About {SITE_CONFIG.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-[#56718d]">{pagesContent.about.description}</p>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-[1440px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2.5rem] border border-[#d7e3ef] bg-white p-8 shadow-[0_18px_50px_rgba(65,101,138,0.08)] lg:p-12">
            <div className="space-y-5 text-base leading-8 text-[#56718d]">
              {pagesContent.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
          <aside className="grid gap-4">
            {pagesContent.about.values.map((value, index) => (
              <div key={value.title} className="rounded-[2rem] border border-[#d7e3ef] bg-white p-6 shadow-[0_16px_42px_rgba(65,101,138,0.08)]">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9b0f06]">0{index + 1}</p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#56718d]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
