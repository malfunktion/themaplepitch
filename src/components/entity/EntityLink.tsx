import Link from 'next/link';

export default function EntityLink({ href, eyebrow, children }: { href: string; eyebrow?: string; children: React.ReactNode }) {
  return <Link href={href} className="group block border border-border bg-surface p-4 transition hover:border-crimson"><div className="text-[9px] font-mono uppercase tracking-[0.2em] text-crimson">{eyebrow}</div><div className="mt-1 font-black group-hover:text-crimson">{children}</div></Link>;
}
