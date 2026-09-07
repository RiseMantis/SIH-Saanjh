/**
 * API client service for Artisan Platform backend.
 * Connects frontend UI to FastAPI backend endpoints.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getAuthToken(): string | null {
  return localStorage.getItem('artisan_jwt');
}

export function setAuthToken(token: string) {
  localStorage.setItem('artisan_jwt', token);
}

export function clearAuthToken() {
  localStorage.removeItem('artisan_jwt');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed: ${response.status}`;
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

// ---------------- AUTH ----------------
export async function registerUser(data: {
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  role: 'artisan' | 'buyer';
  village?: string;
  district?: string;
  state?: string;
  craft_category?: string;
}) {
  const payload = {
    ...data,
    password: data.password || 'artisan123',
  };
  const res = await request<{ access_token: string; token_type: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.access_token) {
    setAuthToken(res.access_token);
  }
  return res;
}

export async function loginUser(credentials: { phone?: string; email?: string; password?: string }) {
  const res = await request<{ access_token: string; token_type: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      ...credentials,
      password: credentials.password || 'artisan123',
    }),
  });
  if (res.access_token) {
    setAuthToken(res.access_token);
  }
  return res;
}

export async function getCurrentUser() {
  return request<any>('/auth/me');
}

export async function mockKyc() {
  return request<{ message: string }>('/auth/mock-kyc', { method: 'POST' });
}

// ---------------- MEDIA & AI ----------------
export async function uploadPhoto(file: Blob, listingId?: string) {
  const formData = new FormData();
  formData.append('file', file, 'product.jpg');
  if (listingId) formData.append('listing_id', listingId);

  return request<{
    raw_url: string;
    enhanced_url: string;
    raw_media_id: string;
    enhanced_media_id: string;
    listing_id?: string;
  }>('/media/photo', {
    method: 'POST',
    body: formData,
  });
}

export async function uploadVoice(audioBlob: Blob, listingId?: string) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'voice.wav');
  if (listingId) formData.append('listing_id', listingId);

  return request<{
    transcript: string;
    detected_language: string;
    audio_url: string;
    media_id: string;
  }>('/media/voice', {
    method: 'POST',
    body: formData,
  });
}

export async function generateCatalog(transcript: string, imageTags?: string[]) {
  return request<{
    title: string;
    description_en: string;
    description_hi: string;
    category: string;
    tags: string[];
  }>('/catalog/generate', {
    method: 'POST',
    body: JSON.stringify({ transcript, image_tags: imageTags }),
  });
}

export async function suggestPricing(params: {
  raw_material_cost: number;
  estimated_hours: number;
  intricacy_score?: number;
  category: string;
  seasonality_multiplier?: number;
}) {
  return request<{
    price_min: number;
    price_max: number;
    explanation: string;
  }>('/catalog/pricing', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      intricacy_score: params.intricacy_score ?? 3,
      seasonality_multiplier: params.seasonality_multiplier ?? 1.0,
    }),
  });
}

// ---------------- LISTINGS ----------------
export async function createListing(data: {
  client_uuid?: string;
  title?: string;
  description_en?: string;
  description_hi?: string;
  category?: string;
  tags?: string[];
  price?: number;
  price_min?: number;
  price_max?: number;
}) {
  return request<any>('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateListing(id: string, patch: any) {
  return request<any>(`/listings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function publishListing(id: string) {
  return request<any>(`/listings/${id}/publish`, {
    method: 'POST',
  });
}

export async function fetchListings(params: {
  category?: string;
  state?: string;
  min_price?: number;
  max_price?: number;
  q?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.state) query.set('state', params.state);
  if (params.min_price != null) query.set('min_price', String(params.min_price));
  if (params.max_price != null) query.set('max_price', String(params.max_price));
  if (params.q) query.set('q', params.q);
  if (params.limit) query.set('limit', String(params.limit));
  if (params.offset) query.set('offset', String(params.offset));

  return request<{
    items: any[];
    total: number;
    limit: number;
    offset: number;
  }>(`/listings?${query.toString()}`);
}

export async function fetchListing(id: string) {
  return request<any>(`/listings/${id}`);
}

export async function fetchArtisanProfile(id: string) {
  return request<any>(`/artisans/${id}`);
}

// ---------------- REQUIREMENTS & MATCHING ----------------
export async function postRequirement(data: {
  title: string;
  description?: string;
  category: string;
  quantity: number;
  max_unit_price?: number;
  preferred_state?: string;
}) {
  return request<any>('/requirements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchRequirementMatches(requirementId: string) {
  return request<any[]>(`/requirements/${requirementId}/matches`);
}

// ---------------- ORDERS & INTEGRATIONS ----------------
export async function createOrder(data: {
  artisan_id: string;
  listing_id?: string;
  requirement_id?: string;
  quantity: number;
  total_amount: number;
}) {
  return request<any>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  return request<any>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchOrders() {
  return request<any[]>('/orders');
}

export async function gemSync(listingId: string) {
  return request<any>('/mock/gem-sync', {
    method: 'POST',
    body: JSON.stringify({ listing_id: listingId }),
  });
}

export async function ondcSync(listingId: string) {
  return request<any>('/mock/ondc-sync', {
    method: 'POST',
    body: JSON.stringify({ listing_id: listingId }),
  });
}

export async function fetchDay1Payment(orderId: string) {
  return request<any>(`/mock/day1-payment/${orderId}`);
}

export async function fetchAuditLogs(listingId?: string) {
  const query = listingId ? `?listing_id=${listingId}` : '';
  return request<any[]>(`/admin/audit-log${query}`);
}
