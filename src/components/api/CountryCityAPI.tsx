import { useEffect, useState } from 'react';

interface Country {
  name: string;
  unicodeFlag: string;
  cities: string[];
}

const CountryCityAPI = ({ onDataFetched }: { onDataFetched: (countries: Country[]) => void }) => {
  const [countries, setCountries] = useState<Country[]>([]);

  // Fetch country and city data
  const fetchCountries = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/info?returns=unicodeFlag,cities');
      const data = await response.json();
      setCountries(data.data); // assuming the data is in `data.data`
      onDataFetched(data.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return null; // No need to render anything
};

export default CountryCityAPI;
