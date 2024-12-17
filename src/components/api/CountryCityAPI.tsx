// import { useEffect, useState } from 'react';

// interface Country {
//   name: string;
//   unicodeFlag: string;
//   cities: string[];
// }

// const CountryCityAPI = ({ onDataFetched }: { onDataFetched: (countries: Country[]) => void }) => {
//   const [countries, setCountries] = useState<Country[]>([]);

//   // Fetch country and city data
//   const fetchCountries = async () => {
//     try {
//       const response = await fetch('https://countriesnow.space/api/v0.1/countries/info?returns=unicodeFlag,cities');
//       const data = await response.json();
//       setCountries(data.data); // assuming the data is in `data.data`
//       onDataFetched(data.data);
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   return null; // No need to render anything
// };

// export default CountryCityAPI;




// import useSWR from 'swr';

// interface Country {
//   name: string;
//   unicodeFlag: string;
//   cities: string[];
// }

// // Define a fetcher function for SWR
// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// const CountryCityAPI = ({ onDataFetched }: { onDataFetched: (countries: Country[]) => void }) => {
//   // Use SWR to fetch data
//   const { data, error, isLoading } = useSWR(
//     'https://countriesnow.space/api/v0.1/countries/info?returns=unicodeFlag,cities',
//     fetcher
//   );

//   // When the data is fetched, call the onDataFetched callback
//   if (data && !isLoading && !error) {
//     onDataFetched(data.data); // assuming the countries are in `data.data`
//   }

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading countries.</div>;

//   return null; // No need to render anything else
// };

// export default CountryCityAPI;



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
  // const { data, error, isLoading } = useSWR(
  //   'https://countriesnow.space/api/v0.1/countries/info?returns=flag,dialCode',
  //   fetcher
  // );
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
