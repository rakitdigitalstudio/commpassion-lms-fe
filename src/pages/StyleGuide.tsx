import { Button } from '@/components/Button'
import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { Progress } from '@/components/Progress'
import { ProgressBar } from '@/components/ProgressBar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge, type Status } from '@/components/StatusBadge'

const statuses: Status[] = ['in-progress', 'completed', 'not-started']

const colorTokens = [
  { name: 'primary', className: 'bg-primary', hex: '#84c6da' },
  { name: 'accent', className: 'bg-accent', hex: '#faea05' },
  { name: 'success', className: 'bg-success', hex: '#22c55e' },
  { name: 'info', className: 'bg-info', hex: '#3b82f6' },
  { name: 'warning', className: 'bg-warning', hex: '#eab308' },
  { name: 'highlight', className: 'bg-highlight', hex: '#a855f7' },
  { name: 'border', className: 'bg-border', hex: '#e5e7eb' },
  { name: 'muted', className: 'bg-muted', hex: '#6b7280' },
] as const

const typeScale = [
  { name: 'display', className: 'text-display font-bold', sample: 'Sign in to your account' },
  { name: 'h2', className: 'text-h2 font-semibold', sample: 'Welcome back, Marco!' },
  { name: 'h3', className: 'text-h3 font-semibold', sample: 'Learning Progress' },
  { name: 'stat', className: 'text-stat font-bold', sample: '40' },
  {
    name: 'base',
    className: 'text-base',
    sample: 'Here’s what’s happening with your learning today.',
  },
  { name: 'sm', className: 'text-sm text-muted', sample: '2h ago' },
] as const

export function StyleGuide() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 p-8">
      <header>
        <h1 className="text-display font-bold">Style Guide</h1>
        <p className="text-sm text-muted mt-1">
          Design tokens for colors and typography. `primary`/`accent` are pulled from Figma; the
          rest are eyeballed from mockups pending Figma Editor access — see README.
        </p>
      </header>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Palette</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colorTokens.map((token) => (
            <div
              key={token.name}
              className="rounded-card shadow-card overflow-hidden border border-border"
            >
              <div className={`h-16 ${token.className}`} />
              <div className="p-3">
                <p className="text-sm font-semibold">{token.name}</p>
                <p className="text-sm text-muted">{token.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Type scale</h2>
        <div className="space-y-4">
          {typeScale.map((type) => (
            <div key={type.name} className="flex items-baseline gap-4 border-b border-border pb-4">
              <span className="w-16 shrink-0 text-sm text-muted">{type.name}</span>
              <p className={type.className}>{type.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Radius &amp; shadow</h2>
        <div className="flex gap-4">
          <div className="rounded-control bg-primary h-16 w-16" />
          <div className="rounded-card shadow-card bg-white border border-border h-16 w-32" />
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="success">Success</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Status badges</h2>
        <div className="flex flex-wrap gap-3">
          {statuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Progress bars</h2>
        <p className="text-sm text-muted mb-3">
          <code>ProgressBar</code> (status-colored) wraps the universal <code>Progress</code>{' '}
          component, which also takes explicit colors.
        </p>
        <div className="max-w-sm space-y-3">
          {statuses.map((status) => (
            <ProgressBar key={status} status={status} value={status === 'completed' ? 100 : 60} />
          ))}
          <Progress value={40} />
          <Progress value={70} trackColor="#D9D9D980" color="#078CB580" />
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Stat cards</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="My Learning List" value={8} color="primary" helperText="+1 this month" />
          <StatCard
            label="Skills Unlocked"
            value={6}
            color="accent"
            helperText="75% completion rate"
          />
          <StatCard label="Hours Learned" value={40} color="success" helperText="+1 this month" />
          <StatCard
            label="My Certificates"
            value={5}
            color="highlight"
            helperText="1 certificate in review"
          />
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Course cards</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CourseCard
            variant="purchased"
            slug="fondasi-komunikasi"
            title="Fondasi Komunikasi"
            instructorName="Indra Herlambang"
            bannerClassName="bg-indigo-600"
            completedModules={4}
            moduleCount={6}
            durationLabel="18h 30m"
            status="in-progress"
            progress={60}
            ctaLabel="Continue Course"
          />
          <CourseCard
            variant="purchased"
            slug="art-of-mc"
            title="The Art of MC"
            instructorName="Nadia Mulya"
            bannerClassName="bg-pink-600"
            completedModules={6}
            moduleCount={6}
            durationLabel="18h 30m"
            status="completed"
            progress={100}
            ctaLabel="View Certificate"
          />
          <CourseCard
            variant="catalog"
            slug="how-to-be-a-great-mc"
            title="How to Be A Great MC"
            instructorName="Indra Herlambang"
            instructorRole="MC | TV Host | Writer"
            bannerClassName="bg-slate-700"
            price={499000}
          />
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Empty state</h2>
        <EmptyState
          icon="📚"
          heading="No courses yet"
          subtext="You haven't purchased any courses. Explore the catalog to get started."
          cta={<Button variant="primary">Explore Online Courses</Button>}
        />
      </section>
    </div>
  )
}
