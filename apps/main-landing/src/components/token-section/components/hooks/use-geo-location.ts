import { useState, useEffect, useRef } from 'react';

interface IpApiGeoLocationResponse {
  country?: string;
}

interface GeoJsGeoLocationResponse {
  name?: string;
}

export const useGeoLocation = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const controller = useRef(new AbortController());

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

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const ipApiData = await fetchLocation<IpApiGeoLocationResponse>(
          'http://ip-api.com/json',
          controller.current,
        );
        if (ipApiData?.country) {
          setCountry(ipApiData.country);
          return;
        }

        const geoJsData = await fetchLocation<GeoJsGeoLocationResponse>(
          'https://get.geojs.io/v1/ip/country.json',
          controller.current,
        );
        if (geoJsData?.name) {
          setCountry(geoJsData.name);
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

    fetchGeoLocation().catch((error) => {
      console.error('Unexpected error in fetching geolocation:', error);
    });

    return () => {
      controller.current.abort();
    };
  }, []);

  return { country, loading };
};
