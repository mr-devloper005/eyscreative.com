'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, Github, Linkedin, Twitter, Youtube } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const socialLinks = [
  { label: 'YouTube', meta: '2.2M views', href: '/contact', icon: Youtube },
  { label: 'GitHub', meta: '1.2K stars', href: '/contact', icon: Github },
  { label: 'Twitter', meta: '19.3K followers', href: '/contact', icon: Twitter },
  { label: 'LinkedIn', meta: '17.7K followers', href: '/contact', icon: Linkedin },
]
const FOOTER_LOGO_SRC = '/favicon%20copy.png'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': '#f7fbff',
    '--editable-footer-text': 'var(--slot4-page-text, #17304d)',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[2.5rem] border border-[var(--editable-border)] bg-white/80 p-6 shadow-[0_20px_60px_rgba(65,101,138,0.10)] backdrop-blur sm:p-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecf4fc] ring-1 ring-[#d9e6f2]">
                  <img src={FOOTER_LOGO_SRC} alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
                </span>
                <span>
                  <span className="block text-lg font-black uppercase tracking-[0.08em]">{SITE_CONFIG.name}</span>
                  <span className="block text-[11px] font-black uppercase tracking-[0.24em] opacity-50">{globalContent.footer?.tagline || SITE_CONFIG.tagline}</span>
                </span>
              </Link>
              <p className="mt-5 max-w-md text-sm leading-7 opacity-70">{globalContent.footer?.description || SITE_CONFIG.description}</p>

              
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.26em] opacity-50">Explore</h3>
                <div className="mt-4 grid gap-2">
                  {taskLinks.map((task) => (
                    <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-bold opacity-75 hover:opacity-100">
                      {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.26em] opacity-50">Site</h3>
                <div className="mt-4 grid gap-2">
                  {[
                    ['About', '/about'],
                    ['Contact', '/contact'],
                    ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
                  ].map(([label, href]) => (
                    <Link key={href} href={href} className="text-sm font-bold opacity-75 hover:opacity-100">
                      {label}
                    </Link>
                  ))}
                  {session ? (
                    <button type="button" onClick={logout} className="text-left text-sm font-bold opacity-75 hover:opacity-100">
                      Logout
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      <div className="border-t border-[var(--editable-border)] px-4 py-5 text-center text-xs font-bold opacity-55">
        © {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}
      </div>
    </footer>
  )
}
