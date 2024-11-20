import useSWR from 'swr';
import { useEffect } from 'react';

interface Country {
  name: string;
  flag: string;
  dialCode: string;
  cities: string[];
}

// Define a fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CountryCityAPI = ({ onDataFetched }: { onDataFetched: (countries: Country[]) => void }) => {
  // Use SWR to fetch country data
  const { data, error, isLoading } = useSWR(
    'https://countriesnow.space/api/v0.1/countries/info?returns=flag,dialCode,cities',
    fetcher
  );

  // useEffect to trigger the onDataFetched callback only after data is available
  useEffect(() => {
    if (data && !isLoading && !error) {
      onDataFetched(data.data); // Assuming the countries are in `data.data`
    }
  }, [data, isLoading, error, onDataFetched]);

    if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading countries.</div>;
  return null; // No need to render anything else
};

export default CountryCityAPI;
