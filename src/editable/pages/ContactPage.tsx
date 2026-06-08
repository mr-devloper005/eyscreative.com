'use client'

import { Image as ImageIcon, Mail, MapPin, Sparkles, UserRound } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const lanes = [
  { icon: ImageIcon, title: 'Visual features', body: 'Reach out about image-led posts, homepage placement, and showcase opportunities.' },
  { icon: UserRound, title: 'Profile support', body: 'Need help with profiles, identity pages, or getting the right details in place?' },
  { icon: Sparkles, title: 'Partnerships', body: 'Discuss collaborations, campaigns, and curated content placements.' },
  { icon: MapPin, title: 'General questions', body: 'Ask about navigation, page support, publishing lanes, or public-facing content.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[#d9e6f2] bg-[linear-gradient(180deg,#ffffff_0%,#eef5fc_100%)]">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9b0f06]">{pagesContent.contact.eyebrow}</p>
                <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">{pagesContent.contact.title}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-9 text-[#56718d]">{pagesContent.contact.description}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {lanes.map((lane) => (
                    <div key={lane.title} className="rounded-[1.8rem] border border-[#d7e3ef] bg-white p-5 shadow-[0_16px_42px_rgba(65,101,138,0.08)]">
                      <lane.icon className="h-5 w-5 text-[#17304d]" />
                      <h2 className="mt-3 text-xl font-black">{lane.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-[#56718d]">{lane.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2.2rem] border border-[#d7e3ef] bg-white p-7 shadow-[0_24px_70px_rgba(65,101,138,0.10)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4fb]">
                    <Mail className="h-5 w-5 text-[#17304d]" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-black">{pagesContent.contact.formTitle}</h2>
                    <p className="text-sm text-[#56718d]">We keep the form simple and route every message through the right lane.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
