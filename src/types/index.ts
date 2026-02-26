export type PolicyStatus = "active" | "expired" | "upcoming" | "unknown";

export interface PolicyBenefit {
  description: string;
  details?: string;
  amount?: string;
  conditions?: string;
  duration?: string;
}

export interface PolicyBenefits {
  tax?: PolicyBenefit;
  subsidy?: PolicyBenefit;
  workspace?: PolicyBenefit;
  social_security?: PolicyBenefit;
  registration?: PolicyBenefit;
  finance?: PolicyBenefit;
  training?: PolicyBenefit;
  compute?: PolicyBenefit;
  trade?: PolicyBenefit;
  residence?: PolicyBenefit;
  [key: string]: PolicyBenefit | undefined;
}

export interface PolicyContact {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface PolicyApplication {
  process?: string[];
  materials?: string[];
  contact?: PolicyContact;
}

export interface PolicyMeta {
  contributor?: string;
  last_verified?: string;
  verified?: boolean;
  notes?: string;
}

export interface Policy {
  id: string;
  city: string;
  district?: string;
  name: string;
  issuer: string;
  publish_date: string;
  effective_date?: string;
  expiry_date?: string;
  status: PolicyStatus;
  policy_number?: string;
  source_url: string;
  summary?: string;
  targets?: string[];
  benefits?: PolicyBenefits;
  requirements?: string[];
  application?: PolicyApplication;
  parks?: string[];
  tags?: string[];
  meta?: PolicyMeta;
}

export interface Park {
  id: string;
  name: string;
  city: string;
  district?: string;
  address?: string;
  type?: string;
  contact?: PolicyContact;
  opc_support?: {
    registration_address?: boolean;
    registration_fee?: string;
    workspace?: boolean;
    workspace_fee?: string;
    [key: string]: boolean | string | undefined;
  };
  related_policies?: string[];
  tags?: string[];
  meta?: PolicyMeta;
}

export interface CityStats {
  city: string;
  policyCount: number;
  activePolicyCount: number;
  parkCount: number;
  latitude: number;
  longitude: number;
}

export type BenefitType =
  | "tax"
  | "subsidy"
  | "workspace"
  | "social_security"
  | "registration"
  | "finance"
  | "training"
  | "compute"
  | "trade"
  | "residence";

export const BENEFIT_LABELS: Record<string, string> = {
  tax: "税收优惠",
  subsidy: "创业补贴",
  workspace: "场地支持",
  social_security: "社保补贴",
  registration: "注册优惠",
  finance: "金融支持",
  training: "培训支持",
  compute: "算力支持",
  trade: "知识产权",
  residence: "落户支持",
};

export const STATUS_LABELS: Record<PolicyStatus, string> = {
  active: "有效",
  expired: "已过期",
  upcoming: "即将生效",
  unknown: "状态未知",
};
