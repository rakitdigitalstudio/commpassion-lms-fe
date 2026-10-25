/** One "Our achievements" figure from Strapi Site Config (`shared.achievement`). */
export interface Achievement {
  /** Free text as the editor typed it, e.g. "5000" or "5000+". */
  count: string
  title: string
  description: string | null
}

/** The Site Config fields the LMS reads. */
export interface SiteConfig {
  achievements: Achievement[]
}

/** Strapi v5 (flattened) `site-config` single type — only the fields we read. */
export interface StrapiSiteConfig {
  achievements: Achievement[] | null
}
