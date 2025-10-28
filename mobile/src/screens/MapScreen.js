import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, RESOURCE_TYPES } from '../constants';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ route, navigation }) => {
  const { resource } = route.params || {};
  
  // Default to Manchester, NH area
  const [region, setRegion] = useState({
    latitude: 42.9847,
    longitude: -71.4774,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Sample resources data
  const sampleResources = [
    { 
      id: 1, 
      name: 'Manchester Homeless Shelter', 
      address: '123 Main St, Manchester, NH', 
      phone: '(603) 555-0123', 
      hours: '24/7', 
      capacity: 'Full',
      latitude: 42.9847,
      longitude: -71.4774,
      type: RESOURCE_TYPES.SHELTER
    },
    { 
      id: 2, 
      name: 'Family Promise of Greater Nashua', 
      address: '456 Elm St, Nashua, NH', 
      phone: '(603) 555-0124', 
      hours: '8AM-8PM', 
      capacity: 'Available',
      latitude: 42.7653,
      longitude: -71.4675,
      type: RESOURCE_TYPES.SHELTER
    },
    { 
      id: 3, 
      name: 'Manchester Food Bank', 
      address: '321 Pine St, Manchester, NH', 
      phone: '(603) 555-0126', 
      hours: '9AM-4PM Mon-Fri', 
      capacity: 'Available',
      latitude: 42.9912,
      longitude: -71.4623,
      type: RESOURCE_TYPES.FOOD
    },
    { 
      id: 4, 
      name: 'Manchester Community Health Center', 
      address: '987 Birch Rd, Manchester, NH', 
      phone: '(603) 555-0128', 
      hours: '8AM-8PM', 
      capacity: 'Available',
      latitude: 42.9783,
      longitude: -71.4845,
      type: RESOURCE_TYPES.HEALTH
    },
  ];

  useEffect(() => {
    if (resource) {
      // If a specific resource is passed, center the map on it
      setRegion({
        latitude: resource.latitude || 42.9847,
        longitude: resource.longitude || -71.4774,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [resource]);

  const getResourceColor = (type) => {
    switch (type) {
      case RESOURCE_TYPES.SHELTER:
        return COLORS.primary;
      case RESOURCE_TYPES.FOOD:
        return COLORS.secondary;
      case RESOURCE_TYPES.HEALTH:
        return COLORS.accent;
      default:
        return COLORS.text;
    }
  };

  const handleMarkerPress = (resource) => {
    // In a real app, we would show a modal or navigate to resource details
    console.log('Selected resource:', resource);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
        >
          {sampleResources.map((resource) => (
            <Marker
              key={resource.id}
              coordinate={{
                latitude: resource.latitude,
                longitude: resource.longitude,
              }}
              title={resource.name}
              description={resource.address}
              onPress={() => handleMarkerPress(resource)}
            >
              <View style={[
                styles.marker,
                { backgroundColor: getResourceColor(resource.type) }
              ]}>
                <Text style={styles.markerText}>
                  {resource.type === RESOURCE_TYPES.SHELTER ? '🏠' : 
                   resource.type === RESOURCE_TYPES.FOOD ? '🍎' : 
                   resource.type === RESOURCE_TYPES.HEALTH ? '🏥' : '📍'}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>Nearby Resources</Text>
          <Text style={styles.mapSubtitle}>Tap on markers for details</Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Resource list at bottom */}
      <View style={styles.resourceList}>
        <Text style={styles.resourceListTitle}>Resources Nearby</Text>
        {sampleResources.slice(0, 3).map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={styles.resourceListItem}
            onPress={() => handleMarkerPress(resource)}
          >
            <View style={styles.resourceIcon}>
              <Text style={styles.resourceIconText}>
                {resource.type === RESOURCE_TYPES.SHELTER ? '🏠' : 
                 resource.type === RESOURCE_TYPES.FOOD ? '🍎' : 
                 resource.type === RESOURCE_TYPES.HEALTH ? '🏥' : '📍'}
              </Text>
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName}>{resource.name}</Text>
              <Text style={styles.resourceAddress}>{resource.address}</Text>
            </View>
            <View style={[
              styles.resourceStatus,
              { 
                backgroundColor: resource.capacity === 'Available' 
                  ? COLORS.secondary 
                  : COLORS.danger 
              }
            ]}>
              <Text style={styles.resourceStatusText}>{resource.capacity}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  mapContainer: {
    flex: 0.6,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resourceList: {
    flex: 0.4,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resourceListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  resourceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceIconText: {
    fontSize: 20,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resourceAddress: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  resourceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resourceStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MapScreen;