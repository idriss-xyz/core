import { useState, useEffect, useRef } from 'react';

interface IpApiGeoLocationResponse {
  country?: string;
}

interface GeoJsGeoLocationResponse {
  name?: string;
}

interface CachedGeoLocation {
  country: string;
  timestamp: number;
}

const CACHE_KEY = 'geoLocation';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

const fetchLocation = async <T>(
  url: string,
  controller: AbortController,
): Promise<T | null> => {
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.statusText}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Request to ${url} was aborted.`);
    } else {
      console.error(`Failed to fetch location from ${url}`, error);
    }
    return null;
  }
};

const getCachedLocation = (): string | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { country, timestamp } = JSON.parse(cached) as CachedGeoLocation;
      if (Date.now() - timestamp < CACHE_EXPIRATION) {
        return country;
      }
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Failed to parse cached geo-location:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  }
  return null;
};

const cacheLocation = (country: string) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ country, timestamp: Date.now() }),
  );
};

export const useGeoLocation = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const controller = useRef(new AbortController());

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const cachedCountry = getCachedLocation();
        if (cachedCountry) {
          setCountry(cachedCountry);
          setLoading(false);
          return;
        }

        const ipApiData = await fetchLocation<IpApiGeoLocationResponse>(
          'http://ip-api.com/json',
          controller.current,
        );
        if (ipApiData?.country) {
          setCountry(ipApiData.country);
          cacheLocation(ipApiData.country);
          return;
        }

        const geoJsData = await fetchLocation<GeoJsGeoLocationResponse>(
          'https://get.geojs.io/v1/ip/country.json',
          controller.current,
        );
        if (geoJsData?.name) {
          setCountry(geoJsData.name);
          cacheLocation(geoJsData.name);
        } else {
          setCountry(null);
        }
      } catch (error) {
        console.error('Unexpected error in fetching geolocation:', error);
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    const currentController = controller.current;

    fetchGeoLocation().catch((error) => {
      console.error('Unexpected error in fetching geolocation:', error);
    });

    return () => {
      currentController.abort();
    };
  }, []);

  return { country, loading };
};
