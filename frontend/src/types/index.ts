export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'NGO' | 'Volunteer';
  registeredEvents: string[];
  token?: string;
}

export interface NGO {
  _id: string;
  user: User;
  name: string;
  description: string;
  address: string;
  contactEmail: string;
  contactPhone?: string;
  verified: boolean;
  events: Event[];
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  ngo: NGO;
  date: string;
  time: string;
  location: string;
  participants: User[];
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'NGO' | 'Volunteer';
  registeredEvents: string[];
  token?: string;
}

export interface ApiError {
  message: string;
}

export interface Stats {
  totalUsers: number;
  totalNGOs: number;
  verifiedNGOs: number;
  pendingNGOs: number;
  totalEvents: number;
  upcomingEvents: number;
}