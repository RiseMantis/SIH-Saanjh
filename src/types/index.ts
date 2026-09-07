export type AppMode = 'artisan' | 'buyer';

export type BuyerAccountType = 'individual' | 'business';

export type CraftCategory =
'Textiles' |
'Pottery' |
'Jewelry' |
'Woodwork' |
'Painting' |
'Metalwork' |
'Basketry';

export interface Language {
  id: string;
  nativeName: string;
  latinName: string;
  sampleGreeting: string;
}

export interface Artisan {
  id: string;
  name: string;
  village: string;
  district: string;
  photo: string;
  craft: CraftCategory;
  trustScore: number;
  groupName: string;
  groupMembers: number;
  ongoingOrders: number;
  completedOrders: number;
  about: string;
  priceRangeLow: number;
  priceRangeHigh: number;
  bulkCapable: boolean;
  monthlyCapacity: number;
  reviews: Review[];
  starredWorks: string[];
}

export interface Review {
  id: string;
  buyerName: string;
  rating: number;
  text: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  artisanId: string;
  category: CraftCategory;
  price: number;
  images: string[];
  description: string;
  likes: number;
  isVideo?: boolean;
  bulkAvailable: boolean;
  madeIn: string;
}

export type OrderStatus =
'ordered' |
'being-made' |
'shipped' |
'delivered' |
'paid';

export interface ClusterMember {
  name: string;
  units: number;
  done: boolean;
}

export interface Order {
  id: string;
  productId: string;
  counterpartName: string;
  counterpartLocation: string;
  amount: number;
  quantity: number;
  status: OrderStatus;
  placedOn: string;
  cluster?: {
    othersCount: number;
    members: ClusterMember[];
  };
}

export type NotificationKind = 'scheme' | 'fair' | 'order';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  headline: string;
  spoken: string;
  detail: string;
  date: string;
}

export interface Fair {
  id: string;
  name: string;
  city: string;
  dates: string;
  image: string;
  stalls: number;
}

export interface MatchResult {
  id: string;
  type: 'artisan' | 'cluster';
  name: string;
  location: string;
  trustScore: number;
  capacity: number;
  unitPrice: number;
  deliveryDays: number;
  members?: string[];
  photo: string;
}