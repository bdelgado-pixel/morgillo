export type Category = "agricola" | "construccion" | "implementos";
export type MediaAsset = {
  id: string;
  url: string;
  alt: string;
  kind: "image" | "pdf";
};
export type Brand = {
  primary?: boolean;
  id: string;
  name: string;
  description: string;
  image: string;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  model: string;
  brandId: string;
  category: Category;
  description: string;
  images: MediaAsset[];
  documents: MediaAsset[];
  specifications: { label: string; value: string; unit?: string }[];
  featured: boolean;
  published: boolean;
  mock: boolean;
};
export type Campaign = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  start: string;
  end: string;
  place: string;
  buttonText: string;
  href: string;
  active: boolean;
  placements: ("home" | "popup")[];
  frequency: "session" | "visit" | "day";
  paths: string[];
};
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image?: string;
  publishedAt: string;
  published: boolean;
};
export type Event = Article & { start: string; end: string; place: string };

export type CategoryItem = {
  id: Category;
  name: string;
  brand: string;
  description: string;
  image: string;
};
export type SiteSettings = {
  name: string;
  url: string;
  phone: string;
  office: string;
  service: string;
  whatsapp: string;
  email?: string;
  address: string;
  hours: string;
  social: { label: string; href: string }[];
  logo: string;
  heroImage: string;
  heroTitle: string;
  heroDescription: string;
  companyTitle: string;
  companyDescription: string;
  seoDescription: string;
};
export type Service = {
  slug: string;
  title: string;
  description: string;
  requirements: string[];
};
export type ContentSnapshot = {
  products: Product[];
  brands: Brand[];
  categories: CategoryItem[];
  campaigns: Campaign[];
  articles: Article[];
  events: Event[];
  services: Service[];
  site: SiteSettings;
  serverNow: string;
};
