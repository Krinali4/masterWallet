
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Loader from '../loader/Loader';

const containerStyle = {
    height: "365px",
    width: "100%",
};

interface Iprops {
    coOrdinates: { lat: number, lng: number }
}

function Map(props: Iprops) {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    })

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map: any) {
        const bounds = new window.google.maps.LatLngBounds(props?.coOrdinates);
        
        console.log(map);
        // map.fitBounds(bounds);
        map.setZoom(17)
        setMap(map);
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    const renderMap = () => {
        if (isLoaded) {
            return (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={props?.coOrdinates}
                    zoom={17}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    <Marker position={props?.coOrdinates} />
                </GoogleMap>
            )
        } else {
            <Loader pshow={!isLoaded} />
        }

    }

    return (renderMap())
}

export default Map;
