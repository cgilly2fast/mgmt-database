import React from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import cities from "./cities";
import { withRouter } from "react-router-dom";

const Map = () => (
  <>
    {/* <button
      onClick={() => this.props.history.goBack()}
      style={{ background: "none", border: "none", marginBottom: "10px" }}
    >
      &lt;- Back
    </button> */}
    <div style={{ height: "1000px" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_APIKEY }}
        defaultCenter={{
          lat: 21.2815556,
          lng: -157.8310903,
        }}
        defaultZoom={14}
      >
        {cities?.map((item) => (
          <Marker
            key={item?.id}
            text="city"
            data={item}
            lat={item?.latitude}
            lng={item?.longitude}
          />
        ))}
      </GoogleMapReact>
    </div>
  </>
);

export default withRouter(Map);
