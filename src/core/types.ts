/** Raw ad object from the Carbon Ads JSON API */
export interface AdResponse {
  ads: RawAd[];
}

/** Raw ad data as returned by srv.carbonads.net */
export interface RawAd {
  /** Standard fields (always present for active ads) */
  description?: string;
  image?: string;
  smallImage?: string;
  statlink?: string;
  statimp?: string;
  statview?: string;
  should_record_viewable?: string;
  bannerid?: string;
  creativeid?: string;
  zonekey?: string;
  zoneid?: string;
  ad_via_link?: string;
  timestamp?: string;

  /** Cover/rich format fields (only present for cover-enabled zones) */
  backgroundColor?: string;
  callToAction?: string;
  company?: string;
  companyTagline?: string;
  ctaBackgroundColor?: string;
  ctaTextColor?: string;
  largeImage?: string;
  logo?: string;
  textColor?: string;

  /** Fallback fields */
  fallbackLink?: string;
  fallbackTitle?: string;

  /** Other */
  custom_css?: string;
  pixel?: string;
  title?: string;
  freqcap?: string;
}

/** Processed ad data ready for rendering */
export interface CarbonAd {
  company: string;
  description: string;
  link: string;
  statlink: string;
  statviewUrl: string;
  image: string;
  smallImage: string;
  largeImage: string;
  logo: string;
  backgroundColor: string;
  callToAction: string;
  companyTagline: string;
  adViaLink: string;
  pixel: string;
}

/** Publisher-provided fallback ad shown during loading and when no paid ad is available. */
export interface CarbonAdFallback {
  company: string;
  description: string;
  link: string;
  companyTagline?: string;
  callToAction?: string;
}

/** Style overrides for the CarbonBox border container. */
export interface CarbonBoxStyle {
  /** Fixed width in columns. Omit to flex-stretch to the parent container. */
  width?: number;
  /** Border color (any Ink/chalk color string, e.g. "gray", "cyan", "#ff0"). Defaults to dim. */
  borderColor?: string;
}

/** SDK configuration */
export interface CarbonConfig {
  /** Zone key (serve ID) */
  serve: string;
  /** Placement identifier */
  placement: string;
}
