import logo from '@/assets/compassion-logo-blue.png'

interface LogoProps {
  className?: string
}

/** The real CommPassion wordmark, copied from compassion-landing-page (src/assets/compassion-logo-blue.png). */
export function Logo({ className }: LogoProps) {
  return <img src={logo} alt="CommPassion" className={className} />
}
