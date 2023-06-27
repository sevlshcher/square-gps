import { BaseApiService } from '@/common/api/base.api-service';

const BASE_URL = 'https://geocode.maps.co/'

const ENDPOINTS = {
  FORWARD: 'search?q={address}',
  REVERSE: 'reverse?lat={lat}&lon={lng}'
}

class GeocodeApiService extends BaseApiService{
  convertAddress (address) {
    return this.get(BASE_URL + ENDPOINTS.FORWARD.replace('{address}', address))
  }
  convertCoords (coords) {
    return this.get(BASE_URL + ENDPOINTS.REVERSE.replace('{lat}', coords.lat).replace('{lng}', coords.lng))
  }
}

export const geocodeApiService = new GeocodeApiService()
