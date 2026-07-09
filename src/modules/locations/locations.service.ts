import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../common/prisma/prisma.service';

interface LocationResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  distance?: number;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  address?: { amenity?: string };
}

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private prisma: PrismaService) {}

  // Fallback static locations if Nominatim is unreachable or returns nothing.
  // These are common hospitals in Karachi.
  private readonly staticLocations: LocationResult[] = [
    {
      id: 'loc-001',
      name: 'Shifa International Hospital',
      address: 'Plot B-5, Scheme 5, Clifton',
      latitude: 24.8126,
      longitude: 67.0354,
      type: 'hospital',
    },
    {
      id: 'loc-002',
      name: 'Aga Khan Hospital',
      address: 'Aga Khan III Road, Karachi',
      latitude: 24.8084,
      longitude: 67.0295,
      type: 'hospital',
    },
    {
      id: 'loc-003',
      name: 'Civil Hospital Karachi',
      address: 'Block 7, Clifton, Karachi',
      latitude: 24.8089,
      longitude: 67.0215,
      type: 'hospital',
    },
    {
      id: 'loc-004',
      name: 'JPMC (Jinnah Postgraduate Medical Centre)',
      address: 'New Town, Karachi',
      latitude: 24.9007,
      longitude: 67.0934,
      type: 'hospital',
    },
    {
      id: 'loc-005',
      name: 'United Hospital',
      address: 'Abdulrahman Patel Street, Karachi',
      latitude: 24.8595,
      longitude: 67.0189,
      type: 'hospital',
    },
  ];

  async searchLocations(
    query: string,
    userLat?: number,
    userLng?: number,
  ): Promise<LocationResult[]> {
    if (!query || query.trim() === '') {
      return this.calculateDistances(this.staticLocations, userLat, userLng);
    }

    const results = await this.searchNominatim(query);
    if (results.length > 0) {
      return this.calculateDistances(results, userLat, userLng);
    }

    // Fallback: filter the static list (case-insensitive) if Nominatim
    // failed or found nothing, so search never fully breaks.
    const queryLower = query.toLowerCase();
    const filtered = this.staticLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(queryLower) ||
        loc.address.toLowerCase().includes(queryLower),
    );
    return this.calculateDistances(filtered, userLat, userLng);
  }

  private async searchNominatim(query: string): Promise<LocationResult[]> {
    try {
      const response = await axios.get<NominatimResult[]>(this.nominatimUrl, {
        params: {
          q: `${query} Karachi`,
          format: 'json',
          limit: 10,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'ResQLinkApp/1.0 (contact: h13676922@gmail.com)',
        },
        timeout: 5000,
      });

      return response.data.map((r) => ({
        id: `osm-${r.place_id}`,
        name: r.address?.amenity || r.display_name.split(',')[0],
        address: r.display_name,
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        type: r.type,
      }));
    } catch (error) {
      this.logger.warn(`Nominatim search failed, using static fallback: ${error.message}`);
      return [];
    }
  }

  private calculateDistances(
    locations: LocationResult[],
    userLat?: number,
    userLng?: number,
  ): LocationResult[] {
    // If user location provided, calculate distance and sort by distance
    if (userLat && userLng) {
      return locations
        .map((loc) => ({
          ...loc,
          distance: this.calculateDistance(userLat, userLng, loc.latitude, loc.longitude),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 10); // Return top 10 closest
    }

    // Otherwise return first 10
    return locations.slice(0, 10);
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
