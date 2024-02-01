import { useState, useMemo, useRef, SetStateAction, Dispatch } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';

import { InfoWindowF, MarkerF } from '@react-google-maps/api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import styles from './Test.module.css';

import { Field, Form, Formik } from 'formik';

export const DEFAULT_DISTANCE_IN_KM = '100';

const configureSchema = Yup.object().shape({
  city: Yup.string().required('Required'),
});

async function getLatLonForCity(city: string) {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`;
  const geocodeResponse = await fetch(geocodeUrl);
  const geocodeData = await geocodeResponse.json();
  const { lat, lng } = geocodeData.results[0].geometry.location;
  return { lon: lng, lat };
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

export type Place = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export default function Test() {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const cityRef = useRef(undefined);

  const [places, setPlaces] = useState<Place[]>([
    { name: '위워크', address: '서울특별시 중구 삼일대로 343', latitude: 37.56, longitude: 126.98 },
  ]);
  const [position, setPosition] = useState({ lat: places[0].latitude, lon: places[0].longitude });
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);

  useEffect(() => {
    setTimeout(() => {
      setPlaces(() => [...places]);
    }, 1000);
  }, []);
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      {isLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={{ lat: position.lat, lng: position.lon }} zoom={17}>
          {places.map((place) => (
            <MarkerF
              key={`${place.address}-${place.name}-${place.latitude}-${place.longitude}`}
              onClick={() => {
                place === selectedPlace ? setSelectedPlace(undefined) : setSelectedPlace(place);
              }}
              position={{ lat: place.latitude, lng: place.longitude }}
            />
          ))}
          {selectedPlace && (
            <InfoWindowF
              position={{ lat: selectedPlace?.latitude, lng: selectedPlace?.longitude }}
              zIndex={1}
              onCloseClick={() => setSelectedPlace(undefined)}
            >
              <div>
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.address}</p>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </>
  );
}

function Map() {}

const PlacesAutocomplete = ({ setSelected }: Dispatch<SetStateAction<null>>) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
