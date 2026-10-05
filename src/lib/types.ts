export type UserRole = 'buyer' | 'seller' | 'admin' | 'super_admin' | 'support';

export type ListingStatus = 'draft' | 'pending' | 'live' | 'reserved' | 'sold' | 'rejected' | 'expired';

export type OrderStatus =
  | 'pending_admin'
  | 'admin_approved'
  | 'awaiting_payment'
  | 'paid_escrow'
  | 'chat_unlocked'
  | 'meetup_scheduled'
  | 'completed'
  | 'disputed'
  | 'cancelled'
  | 'refunded';

export type Condition = 'brand_new' | 'like_new' | 'good' | 'fair' | 'for_parts';

export interface User {
  id: string;
  name: string;
  email: string;
  regNumber: string;
  school: string;
  yearOfStudy: number;
  hostel?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isTrustedSeller: boolean;
  totalSales: number;
  rating: number;
  responseTime: string;
  joinedAt: string;
  badges: string[];
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  condition: Condition;
  category: string;
  subcategory: string;
  description: string;
  images: string[];
  location: string;
  status: ListingStatus;
  seller: User;
  tags: string[];
  quantity: number;
  brand?: string;
  defects?: string;
  ageInMonths?: number;
  reasonForSelling?: string;
  views: number;
  favourites: number;
  createdAt: string;
  expiresAt: string;
  isFavourited?: boolean;
}

export interface Order {
  id: string;
  listing: Listing;
  buyer: User;
  seller: User;
  status: OrderStatus;
  amount: number;
  platformFee: number;
  sellerPayout: number;
  commissionRate: number;
  handoverCode?: string;
  meetupLocation: string;
  meetupTime?: string;
  mpesaRef?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderEvent[];
}

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  time: string;
  note?: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  isBlocked: boolean;
  sentAt: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'listing' | 'chat' | 'payment' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface WantedPost {
  id: string;
  title: string;
  description: string;
  maxPrice: number;
  category: string;
  postedBy: User;
  createdAt: string;
  offers: number;
}

export const CATEGORIES = [
  { id: 'electronics', label: 'Electronics & Phones', icon: '📱', subcategories: ['Smartphones', 'Feature Phones', 'Chargers', 'Headphones', 'Speakers'] },
  { id: 'laptops', label: 'Laptops & Accessories', icon: '💻', subcategories: ['Laptops', 'Chargers', 'Bags', 'Mice & Keyboards', 'Storage'] },
  { id: 'textbooks', label: 'Textbooks & Notes', icon: '📚', subcategories: ['Engineering', 'Science', 'Business', 'Arts', 'Medical', 'CATs & Notes'] },
  { id: 'hostel', label: 'Hostel & Room', icon: '🛏️', subcategories: ['Mattresses', 'Bedding', 'Kettles', 'Stoves', 'Gas & Cylinders', 'Buckets', 'Curtains'] },
  { id: 'clothing', label: 'Clothing & Shoes', icon: '👕', subcategories: ['Men', 'Women', 'Shoes', 'Bags', 'Accessories'] },
  { id: 'kitchen', label: 'Kitchenware', icon: '🍳', subcategories: ['Sufuria', 'Jikos', 'Plates', 'Cutlery', 'Containers'] },
  { id: 'furniture', label: 'Furniture', icon: '🪑', subcategories: ['Chairs', 'Tables', 'Shelves', 'Wardrobes'] },
  { id: 'bicycles', label: 'Bicycles & Motorbikes', icon: '🚲', subcategories: ['Bicycles', 'Motorbikes', 'Accessories'] },
  { id: 'sports', label: 'Sports', icon: '⚽', subcategories: ['Balls', 'Gear', 'Gym Equipment', 'Outdoor'] },
  { id: 'stationery', label: 'Stationery', icon: '✏️', subcategories: ['Pens', 'Notebooks', 'Files', 'Calculators'] },
  { id: 'uniforms', label: 'Lab Coats & Uniforms', icon: '🥼', subcategories: ['Lab Coats', 'Safety Boots', 'Uniforms'] },
  { id: 'services', label: 'Services', icon: '🛠️', subcategories: ['Tutoring', 'Laundry', 'Printing', 'Hair', 'Graphic Design', 'Photography'] },
  { id: 'food', label: 'Food & Snacks', icon: '🍲', subcategories: ['Cooked Food', 'Snacks', 'Drinks', 'Groceries'] },
  { id: 'other', label: 'Other', icon: '📦', subcategories: ['Other'] },
];

export const CAMPUS_LOCATIONS = [
  'Main Library',
  'Main Gate',
  'Student Centre',
  'Gate C Hostel Area',
  'Gate A Hostel Area',
  'Chiromo Hostel',
  'Engineering Block',
  'Science Building',
  'Business School',
  'Cafeteria',
  'Sports Complex',
  'Pharmacy Building',
];

export const CONDITIONS: { value: Condition; label: string; color: string }[] = [
  { value: 'brand_new', label: 'Brand New', color: 'text-jk-green-600' },
  { value: 'like_new', label: 'Like New', color: 'text-jk-green-500' },
  { value: 'good', label: 'Good', color: 'text-jk-gold-600' },
  { value: 'fair', label: 'Fair', color: 'text-orange-500' },
  { value: 'for_parts', label: 'For Parts', color: 'text-red-500' },
];
