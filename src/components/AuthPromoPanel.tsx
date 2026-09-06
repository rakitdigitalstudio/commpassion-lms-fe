interface PromoStatProps {
  value: string
  label: string
}

function PromoStat({ value, label }: PromoStatProps) {
  return (
    <div>
      <p className="text-h2 font-bold">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  )
}

/**
 * Promo panel shared by Login and Register (right side of the two-column
 * auth layout). Hardcoded per the mockup — Ticket #9 flags this exact
 * question ("confirm with Irene whether this is hardcoded or should
 * eventually come from Strapi site_config") — unresolved, see TODO.md.
 * The featured-course image is a plain color placeholder; no real
 * asset/pipeline for it exists yet.
 */
export function AuthPromoPanel() {
  return (
    <div className="hidden items-center p-8 lg:flex">
      <div className="w-full rounded-card bg-primary p-10 text-white">
        <h2 className="text-display font-bold">
          Communicate to <span className="font-black">Influence</span>.
          <br />
          Lead to <span className="font-black">Inspire</span>.
        </h2>
        <p className="mt-4 max-w-md opacity-90">
          Join thousands of learners transforming how they connect, communicate, and lead.
        </p>

        <div className="mt-8 flex gap-8">
          <PromoStat value="5000+" label="Voices Empowered" />
          <PromoStat value="150+" label="Learning Experiences" />
          <PromoStat value="50+" label="Trusted Partnerships" />
        </div>

        <div className="mt-8 overflow-hidden rounded-card">
          <div className="relative h-56 bg-slate-800">
            <span className="bg-accent text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold">
              Featured Course
            </span>
          </div>
          <div className="bg-primary p-4">
            <p className="font-semibold">How to Be A Great MC</p>
            <p className="text-sm opacity-90">By Indra Herlambang • 12 Video Modules</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-white/30">
                <div className="h-full w-1/5 rounded-full bg-white" />
              </div>
              <span className="text-xs opacity-90">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
