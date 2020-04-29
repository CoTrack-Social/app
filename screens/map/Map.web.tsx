/* global google */
import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import GoogleMapReact from 'google-map-react';
import Modal from 'modal-enhanced-react-native-web';

import { getHeatmapData, getHeatmapSocialData } from '../../api/services';
import { useLocation } from '../../hooks/use-location';
import Constants from 'expo-constants';
import Colors from '../../constants/Colors';
import i18n from 'i18n-js';

import {
  shouldUpdateHeatMap,
  heatmapInitialValues,
  HEATMAP_WEB_ZOOM,
  HEATMAP_WEB_RADIUS,
  HEATMAP_WEB_OPACITY,
  HEATMAP_GET_DATA_DISTANCE,
  DEFAULT_LOCATION_WEB,
} from './mapConfig';

import { mapStyles } from './mapStyles';

export default function Map({ navigation }) {
  const [heatmapData, setHeatmapData] = useState(heatmapInitialValues);
  const [heatmapDataAux, setHeatmapDataAux] = useState(heatmapInitialValues);

  const { location } = useLocation();

  const [coords, setCoords] = useState(
    location
      ? {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        }
      : DEFAULT_LOCATION_WEB,
  );

  const [zoom, setZoom] = useState(HEATMAP_WEB_ZOOM);

  const [isVisibleModalSocial, setIsVisibleModalSocial] = useState(true);

  useEffect(() => {
    if (location) {
      const locationCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      if (shouldUpdateHeatMap(heatmapData, locationCoords)) {
        getHeatmapData({
          ...locationCoords,
          distance: HEATMAP_GET_DATA_DISTANCE,
        })
          .then((response) => {
            const positions = response.data;
            const mapData = {
              positions: positions,
              options: {
                radius: HEATMAP_WEB_RADIUS,
                opacity: HEATMAP_WEB_OPACITY,
              },
            };
            const now = new Date().getTime();
            const heatmapData = {
              mapData: mapData,
              lastUpdated: now,
              center: locationCoords,
              isSocial: false,
            };

            setCoords(locationCoords);
            setHeatmapData(heatmapData);
          })
          .catch((error) => {
            console.log(error);
          });

        getHeatmapSocialData({
          ...locationCoords,
          distance: HEATMAP_GET_DATA_DISTANCE,
        })
          .then((response) => {
            const positions = response.data;
            const mapData = {
              positions: positions,
              options: {
                radius: HEATMAP_WEB_RADIUS,
                opacity: HEATMAP_WEB_OPACITY,
              },
            };
            const now = new Date().getTime();
            const heatmapData = {
              mapData: mapData,
              lastUpdated: now,
              center: locationCoords,
              isSocial: true,
            };

            setHeatmapDataAux(heatmapData);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [location]);

  const MyPosition = () => (
    <div
      style={{
        backgroundColor: 'rgba(66, 135, 244, 1)',
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        height: 15,
        width: 15,
      }}
    ></div>
  );

  const webStyles = StyleSheet.create({
    buttonContainerWeb: {
      ...mapStyles.buttonContainer,
      position: 'absolute',
      zIndex: 9999,
      right: 0,
    },
  });

  const mapRef = useRef<GoogleMapReact>();

  return (
    <View style={[mapStyles.container]}>
      <SafeAreaView style={webStyles.buttonContainerWeb}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[mapStyles.button, mapStyles.locationButton]}
          onPress={() => navigation.navigate({ name: 'Help', key: 'help-map' })}
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-help-circle-outline`}
            size={24}
            color="rgba(66,135,244,1)"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            mapStyles.button,
            mapStyles.layerButton,
            { backgroundColor: heatmapData.isSocial ? 'green' : 'gray' },
          ]}
          onPress={() => {
            setHeatmapData(heatmapInitialValues);

            setTimeout(() => {
              const aux = heatmapData;
              setHeatmapData(heatmapDataAux);
              setHeatmapDataAux(aux);
              setIsVisibleModalSocial(true);
            }, 100);
          }}
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-people`}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[mapStyles.button, mapStyles.infoButton]}
          disabled={!location}
          onPress={() => {
            setZoom(-1);

            const bounds = new mapRef.current.maps_.LatLngBounds();
            var latLng = new mapRef.current.maps_.LatLng(
              location.coords.latitude,
              location.coords.longitude,
            );
            bounds.extend(latLng);

            mapRef.current.map_.fitBounds(bounds);
            setTimeout(() => {
              setZoom(HEATMAP_WEB_ZOOM);
            }, 10);
          }}
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-locate`}
            size={24}
            color={!location ? Colors.tabIconDefault : 'rgba(66, 135, 244, 1)'}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <GoogleMapReact
        ref={mapRef}
        bootstrapURLKeys={{
          key: `${
            process.env.REACT_NATIVE_GOOGLE_API_KEY ||
            Constants.manifest.extra.googleMapsWebApiKey
          }`,
        }}
        center={coords}
        zoom={zoom}
        defaultZoom={HEATMAP_WEB_ZOOM}
        heatmapLibrary={true}
        heatmap={heatmapData.mapData}
        options={{ fullscreenControl: false, zoomControl: false }}
      >
        {location ? (
          <MyPosition
            lat={location.coords.latitude}
            lng={location.coords.longitude}
          />
        ) : null}
      </GoogleMapReact>
      <Modal
        isVisible={isVisibleModalSocial}
        onSwipe={() => setIsVisibleModalSocial(false)}
        swipeDirection="left"
      >
        <View style={mapStyles.modalContent}>
          <Text style={mapStyles.modalTitle}>
          {heatmapData.isSocial ? i18n.t('Heatmap_issocial') : i18n.t('Heatmap_isofficial')}
          </Text>
          <Text
            style={[
              mapStyles.modalBody,
              { textAlign: 'center', borderWidth: 0 },
            ]}
          >
            {heatmapData.isSocial
              ? i18n.t('Heatmap_issocial_text')
              : i18n.t('Heatmap_isofficial_text')}
          </Text>

          <TouchableOpacity onPress={() => setIsVisibleModalSocial(false)}>
            <View style={mapStyles.modalButton}>
              <Text style={{ color: 'white' }}>{i18n.t('Accept')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
