export type DeviceView = 'desktop' | 'tablet' | 'mobile';

export type TenantType = 'LPK' | 'General';

export type StudioTheme = 'indigo' | 'emerald' | 'violet' | 'amber';

export type BlockType = 
  | 'header'
  | 'hero'
  | 'stats'
  | 'features'
  | 'programs'
  | 'testimonials'
  | 'lead-form'
  | 'faq'
  | 'cta-banner'
  | 'footer';

export interface BaseBlock {
  id: string;
  type: BlockType;
  title: string;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeaderBlock extends BaseBlock {
  type: 'header';
  brandName: string;
  logoUrl?: string;
  tagline?: string;
  navItems: HeaderNavItem[];
  ctaText: string;
  ctaWhatsapp: string;
  isSticky: boolean;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaWhatsapp: string;
  secondaryCtaText: string;
  trustText: string;
}

export interface StatsBlock extends BaseBlock {
  type: 'stats';
  items: Array<{
    label: string;
    value: string;
    description: string;
  }>;
}

export interface FeaturesBlock extends BaseBlock {
  type: 'features';
  subtitle: string;
  items: Array<{
    title: string;
    description: string;
    tag: string;
  }>;
}

export interface ProgramsBlock extends BaseBlock {
  type: 'programs';
  subtitle: string;
  items: Array<{
    name: string;
    duration: string;
    badge: string;
    description: string;
    price: string;
    features: string[];
    isPopular?: boolean;
  }>;
}

export interface TestimonialsBlock extends BaseBlock {
  type: 'testimonials';
  subtitle: string;
  items: Array<{
    name: string;
    role: string;
    content: string;
    placement: string;
    rating: number;
  }>;
}

export interface LeadFormBlock extends BaseBlock {
  type: 'lead-form';
  badge: string;
  headline: string;
  subheadline: string;
  submitButtonText: string;
  whatsappDirectNumber: string;
  showSchoolField: boolean;
  showProgramField: boolean;
  successMessage: string;
  // Native CRM & CAPI Tracking Options
  syncToNexaCRM?: boolean;
  tenantSlug?: string;
  metaPixelId?: string;
  autoCaptureUtm?: boolean;
}

export interface FaqBlock extends BaseBlock {
  type: 'faq';
  subtitle: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface CtaBannerBlock extends BaseBlock {
  type: 'cta-banner';
  badge: string;
  headline: string;
  subheadline: string;
  buttonText: string;
  whatsappNumber: string;
}

export interface FooterBlock extends BaseBlock {
  type: 'footer';
  brandName: string;
  tagline: string;
  address: string;
  whatsappNumber: string;
  copyrightText: string;
}

export type BlockItem = 
  | HeaderBlock
  | HeroBlock
  | StatsBlock
  | FeaturesBlock
  | ProgramsBlock
  | TestimonialsBlock
  | LeadFormBlock
  | FaqBlock
  | CtaBannerBlock
  | FooterBlock;

export interface PageConfig {
  id: string;
  title: string;
  tenantName: string;
  tenantType: TenantType;
  theme: StudioTheme;
  metaDescription: string;
  blocks: BlockItem[];
  crmConfig?: {
    tenantSlug?: string;
    autoSync?: boolean;
    crmApiUrl?: string;
  };
  tracking?: {
    metaPixelId?: string;
    googleAnalyticsId?: string;
    autoCaptureUtm?: boolean;
  };
  isPublished?: boolean;
  publishedAt?: string;
  publishPlan?: 'free' | 'cloud' | 'custom_domain';
  customDomain?: string;
}

