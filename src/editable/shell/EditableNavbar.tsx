'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

type NavLink = { label: string; href: string }
const NAVBAR_LOGO_SRC = '/favicon%20copy.png'

export function EditableNavbar() {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = {
    '--editable-nav-bg': 'rgba(255,255,255,0.88)',
    '--editable-nav-text': preset.colors.foreground,
    '--editable-nav-active': '#edf4fb',
    '--editable-nav-active-text': preset.colors.foreground,
    '--editable-cta-bg': 'var(--slot4-accent-fill)',
    '--editable-cta-text': '#ffffff',
    '--editable-search-bg': '#f4f8fc',
    '--editable-border': '#d7e3ef',
    '--editable-container': '1440px',
  } as CSSProperties

  const taskLinks = useMemo(
    () =>
      SITE_CONFIG.tasks
        .filter((task) => task.enabled && task.key !== 'profile')
        .slice(0, 5)
        .map((task) => ({ label: task.label, href: task.route })),
    []
  )

  const desktopLinks: NavLink[] =
    globalContent.nav.primaryLinks.length >= 4
      ? globalContent.nav.primaryLinks.map((item) => ({ label: item.label, href: item.href }))
      : [{ label: 'Home', href: '/' }, ...taskLinks]

  return (
    <header
      style={navVars}
      className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-2xl"
    >
      <nav className="mx-auto flex min-h-[78px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[#ecf4fc] shadow-sm ring-1 ring-[#d9e6f2]">
            <img src={NAVBAR_LOGO_SRC} alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block max-w-[190px] truncate text-sm font-black uppercase tracking-[0.08em]">{SITE_CONFIG.name}</span>
            <span className="hidden max-w-[190px] truncate text-[10px] font-black uppercase tracking-[0.24em] opacity-50 sm:block">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {desktopLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  active ? 'bg-[var(--editable-nav-active)] text-[var(--editable-nav-active-text)]' : 'hover:bg-[#f4f8fc]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 max-w-md flex-1 xl:flex">
          <label className="relative flex w-full items-center rounded-2xl border border-[var(--editable-border)] bg-[var(--editable-search-bg)] px-4 py-3">
            <Search className="h-4 w-4 opacity-50" />
            <input
              name="q"
              type="search"
              placeholder="Search visuals, profiles, and stories"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-current/40"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-2xl bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-black text-[var(--editable-cta-text)] shadow-sm sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Create
              </Link>
              <button type="button" onClick={logout} className="hidden rounded-2xl px-3 py-2 text-sm font-bold hover:bg-[#f4f8fc] sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-2xl px-3 py-2 text-sm font-bold hover:bg-[#f4f8fc] sm:inline-flex">
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Login
                </span>
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-2xl border border-[#6fa9ff] bg-white px-4 py-2.5 text-sm font-black text-[#2674ff] shadow-sm sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-2xl border border-[var(--editable-border)] bg-white p-2.5 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-white/95 px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex rounded-2xl border border-[var(--editable-border)] bg-[var(--editable-search-bg)] px-3 py-3">
            <Search className="mt-1 h-4 w-4 opacity-50" />
            <input name="q" type="search" placeholder="Search visuals, profiles, and stories" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...taskLinks, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-black">
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl bg-[var(--editable-cta-bg)] px-4 py-3 text-sm font-black text-white">
                  Create
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-left text-sm font-black">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-black">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl border border-[#6fa9ff] bg-white px-4 py-3 text-sm font-black text-[#2674ff]">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
