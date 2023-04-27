import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import cities from "./cities";
import NewtonLoader from "../loader/ NewtonLoader/NewtonLoader";
import { listOfCitytype } from "../../API/Types";

const Map: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [listOfCity, setListOfCity] = useState<listOfCitytype[]>([]);

  useEffect(() => {
    setLoading(true);
    setListOfCity(cities);
    setLoading(false);
  }, []);

  return loading ? (
    <NewtonLoader />
  ) : (
    <div style={{ height: "1000px" }}>
      {listOfCity && listOfCity?.length ? (
        <GoogleMapReact
          bootstrapURLKeys={{ key: `${process.env.REACT_APP_APIKEY}` }}
          defaultCenter={{
            lat: 21.2815556,
            lng: -157.8310903,
          }}
          defaultZoom={14}
          style={{ position: "inherit" }}
          yesIWantToUseGoogleMapApiInternals
        >
          {listOfCity?.map((item: listOfCitytype) => (
            <Marker
              key={item?.id}
              text="city"
              tooltip={item}
              lat={item?.latitude}
              lng={item?.longitude}
            />
          ))}
        </GoogleMapReact>
      ) : null}
    </div>
  );
};

export default Map;
