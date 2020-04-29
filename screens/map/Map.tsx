import React, { useRef, useState, useEffect } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import SwipeablePanel from 'rn-swipeable-panel';
import { getHeatmapData, getHeatmapSocialData } from '../../api/services';

import { useLocation } from '../../hooks/use-location';
import Colors from '../../constants/Colors';
import i18n from 'i18n-js';

import { panelStyles, mapStyles } from './mapStyles';
import {
  shouldUpdateHeatMap,
  heatmapInitialValues,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  HEATMAP_WEB_RADIUS,
  HEATMAP_WEB_OPACITY,
  HEATMAP_GET_DATA_DISTANCE,
  DEFAULT_LOCATION,
} from './mapConfig';

function PanelContent() {
  return (
    <View style={panelStyles.panel}>
      <View style={{ paddingBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={panelStyles.panelTitle}>{i18n.t('Gathering_data')}</Text>
        </View>
        <Text style={panelStyles.panelSubtitle}>
          {i18n.t('Gathering_data_text')}
        </Text>
      </View>
      <Text style={panelStyles.panelSubtitle}>
        {i18n.t('Gathering_data_longtext')}
      </Text>
    </View>
  );
}

function PanelHeader(props) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <TouchableWithoutFeedback {...props}>
        <View style={panelStyles.barContainer}>
          <View style={panelStyles.bar} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default function Map({ navigation }) {
  const { location, error } = useLocation({ runInBackground: true });
  const [mapReady, setMapReady] = useState(false);
  const [heatmapData, setHeatmapData] = useState(heatmapInitialValues);
  const [heatmapDataAux, setHeatmapDataAux] = useState(heatmapInitialValues);
  const [bottomPanel, setBottomPanel] = useState(true);
  const [isVisibleModalSocial, setIsVisibleModalSocial] = useState(true);

  const mapRef = useRef<MapView>();

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
            const mapData = positions.map((item) => ({
              latitude: item.lat,
              longitude: item.lng,
              weight: item.weight,
            }));
            const now = new Date().getTime();
            const heatmapData = {
              mapData: mapData,
              lastUpdated: now,
              center: locationCoords,
              isSocial: false,
            };
            // setCoords({
            //   latitude: location.coords.latitude,
            //   longitude: location.coords.longitude,
            // });
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

            const mapData = positions.map((item) => ({
              latitude: item.lat,
              longitude: item.lng,
              weight: item.weight,
            }));
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

  return (
    <SafeAreaView style={[mapStyles.container]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        loadingEnabled
        initialRegion={
          location
            ? {
                ...location.coords,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            : undefined
        }
        initialCamera={{
          // center: coords,
          center: location ? location.coords : DEFAULT_LOCATION,
          pitch: 1,
          heading: 1,
          altitude: 11,
          zoom: 4,
        }}
        style={mapStyles.map}
        showsMyLocationButton={false}
        onMapReady={() => setMapReady(true)}
      >
        {heatmapData.mapData && heatmapData.mapData.length > 0 ? (
          <Heatmap
            points={heatmapData.mapData}
            radius={HEATMAP_WEB_RADIUS / 3}
            opacity={HEATMAP_WEB_OPACITY}
          />
        ) : null}
      </MapView>

      <View style={mapStyles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[mapStyles.button, mapStyles.locationButton]}
          onPress={() => navigation.navigate('Help')}
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
          onPress={() =>
            mapRef.current.animateToRegion({
              ...location.coords,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            })
          }
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-locate`}
            size={24}
            color={!location ? Colors.tabIconDefault : 'rgba(66, 135, 244, 1)'}
          />
        </TouchableOpacity>
      </View>
      <PanelHeader onPress={() => setBottomPanel(true)} />
      <SwipeablePanel
        isActive={bottomPanel}
        onClose={() => setBottomPanel(false)}
        onPressCloseButton={() => setBottomPanel(false)}
        showCloseButton
        >
  			<PanelContent />
  		</SwipeablePanel>
      <Modal
        animationType="slide"
        transparent={true}
        presentationStyle="overFullScreen"
        visible={isVisibleModalSocial}
      >
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', margin: 20 }}>
          <Text style={mapStyles.modalTitle}>
            {heatmapData.isSocial ? i18n.t('Heatmap_issocial') : i18n.t('Heatmap_isofficial')}
          </Text>
          <Text
            style={[
              mapStyles.modalBody,
              {
                borderRightWidth: 0,
                borderLeftWidth: 0,
                borderWidth: 0,
                textAlign: 'center'
              },
            ]}
          >
            {heatmapData.isSocial
              ? i18n.t('Heatmap_issocial_text')
              : i18n.t('Heatmap_isofficial_text')}
          </Text>
          <View style={{ backgroundColor: 'white' }}>
            <TouchableOpacity onPress={() => setIsVisibleModalSocial(false)}>
              <View style={mapStyles.modalButton}>
                <Text style={{ color: 'white' }}>{i18n.t('Accept')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
