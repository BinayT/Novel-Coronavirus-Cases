import React from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';

import './Map.css';

const Map = ({ center, zoom }) => {
  console.log(center, zoom);
  return (
    <div className='map'>
      <LeafletMap className='leaflet-container' center={center} zoom={zoom}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeafletMap>
    </div>
  );
};

export default Map;
