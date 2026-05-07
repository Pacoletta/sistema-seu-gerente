import { IconType } from "react-icons";

export interface TrustIndicator {
  icon: IconType;
  label: string;
  color: string;
}

export interface Feature {
  icon: IconType;
  title: string;
  description: string;
  gradient: {
    from: string;
    to: string;
  };
  glowColor: string;
}

export interface PricingFeature {
  text: string;
  highlight: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  isPremium?: boolean;
  badge?: string;
  gradient?: {
    from: string;
    via: string;
    to: string;
  };
}

export interface ContactInfo {
  icon: IconType;
  text: string;
  color?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
