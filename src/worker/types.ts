// Types for the band management platform

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  bandId: string;
  createdAt: Date;
}

export interface Band {
  id: string;
  name: string;
  genre: string;
  createdAt: Date;
}

export interface Show {
  id: string;
  bandId: string;
  
  // Venue Information
  venueName: string;
  venueAddress: string;
  eventDate: Date;
  
  // Point of Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // Times
  loadInTime: string; // HH:MM format
  soundCheckTime: string; // HH:MM format
  doorsTime: string; // HH:MM format
  performanceTime: string; // HH:MM format
  
  // Logistics
  parkingDetails: string;
  backlineDrums: string;
  backlineBass: string;
  soundProvided: string;
  
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    bandId: string;
  };
}
