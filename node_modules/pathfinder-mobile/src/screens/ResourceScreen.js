import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { COLORS, RESOURCE_TYPES, FILTER_OPTIONS } from '../constants';

const ResourceScreen = ({ route, navigation }) => {
  const { resourceType } = route.params || { resourceType: RESOURCE_TYPES.SHELTER };
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    eligibility: 'all',
    distance: '10',
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Sample data - in real app, this would come from API
  const sampleResources = {
    [RESOURCE_TYPES.SHELTER]: [
      { id: 1, name: 'Manchester Homeless Shelter', address: '123 Main St, Manchester, NH', phone: '(603) 555-0123', hours: '24/7', capacity: 'Full', eligibility: ['all'] },
      { id: 2, name: 'Family Promise of Greater Nashua', address: '456 Elm St, Nashua, NH', phone: '(603) 555-0124', hours: '8AM-8PM', capacity: 'Available', eligibility: ['families'] },
      { id: 3, name: 'YWCA Manchester', address: '789 Oak St, Manchester, NH', phone: '(603) 555-0125', hours: '24/7', capacity: 'Available', eligibility: ['women'] },
    ],
    [RESOURCE_TYPES.FOOD]: [
      { id: 1, name: 'Manchester Food Bank', address: '321 Pine St, Manchester, NH', phone: '(603) 555-0126', hours: '9AM-4PM Mon-Fri', eligibility: ['all'] },
      { id: 2, name: 'Nashua Soup Kitchen', address: '654 Maple Ave, Nashua, NH', phone: '(603) 555-0127', hours: '11AM-1PM Daily', eligibility: ['all'] },
    ],
    [RESOURCE_TYPES.HEALTH]: [
      { id: 1, name: 'Manchester Community Health Center', address: '987 Birch Rd, Manchester, NH', phone: '(603) 555-0128', hours: '8AM-8PM', eligibility: ['all'] },
      { id: 2, name: 'Nashua Free Clinic', address: '147 Cedar Ln, Nashua, NH', phone: '(603) 555-0129', hours: '9AM-5PM Mon-Fri', eligibility: ['all'] },
    ],
    [RESOURCE_TYPES.JOB]: [
      { id: 1, name: 'NH Works Manchester', address: '258 Spruce St, Manchester, NH', phone: '(603) 555-0130', hours: '8AM-4PM Mon-Fri', eligibility: ['all'] },
      { id: 2, name: 'OneWorkSource Nashua', address: '369 Willow Dr, Nashua, NH', phone: '(603) 555-0131', hours: '8AM-5PM Mon-Fri', eligibility: ['all'] },
    ],
  };

  useEffect(() => {
    setResources(sampleResources[resourceType] || []);
  }, [resourceType]);

  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedFilters, resources]);

  const filterResources = () => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply eligibility filter (if not 'all')
    if (selectedFilters.eligibility !== 'all') {
      filtered = filtered.filter(resource =>
        resource.eligibility.includes(selectedFilters.eligibility)
      );
    }

    setFilteredResources(filtered);
  };

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    setShowFilterModal(false);
  };

  const renderResourceItem = ({ item }) => (
    <View style={styles.resourceCard}>
      <View style={styles.resourceHeader}>
        <Text style={styles.resourceName}>{item.name}</Text>
        {item.capacity && (
          <View style={[
            styles.capacityBadge,
            { backgroundColor: item.capacity === 'Available' ? COLORS.secondary : COLORS.danger }
          ]}>
            <Text style={styles.capacityText}>{item.capacity}</Text>
          </View>
        )}
      </View>
      <Text style={styles.resourceAddress}>{item.address}</Text>
      <Text style={styles.resourcePhone}>📞 {item.phone}</Text>
      <Text style={styles.resourceHours}>🕐 {item.hours}</Text>
      <View style={styles.resourceActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // In a real app, this would initiate a phone call
            console.log('Call:', item.phone);
          }}
        >
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.directionsButton]}
          onPress={() => {
            // In a real app, this would open navigation
            console.log('Navigate to:', item.address);
            navigation.navigate('Map', { resource: item });
          }}
        >
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getFilterTitle = () => {
    switch (resourceType) {
      case RESOURCE_TYPES.SHELTER:
        return 'Shelters';
      case RESOURCE_TYPES.FOOD:
        return 'Food Programs';
      case RESOURCE_TYPES.HEALTH:
        return 'Healthcare';
      case RESOURCE_TYPES.JOB:
        return 'Job Opportunities';
      default:
        return 'Resources';
    }
  };

  const getFilterOptions = () => {
    const eligibility = FILTER_OPTIONS.ELIGIBILITY.filter(option => 
      option.key !== 'pets' && option.key !== 'lgbtq'
    );

    return {
      ...FILTER_OPTIONS,
      ELIGIBILITY: eligibility,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getFilterTitle()}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderResourceItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>

            {/* Eligibility Filter */}
            <Text style={styles.filterLabel}>Eligibility</Text>
            {getFilterOptions().ELIGIBILITY.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  selectedFilters.eligibility === option.key && styles.selectedFilterOption
                ]}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  eligibility: option.key
                }))}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilters.eligibility === option.key && styles.selectedFilterOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Distance Filter */}
            <Text style={styles.filterLabel}>Distance</Text>
            {getFilterOptions().DISTANCE.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  selectedFilters.distance === option.key && styles.selectedFilterOption
                ]}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  distance: option.key
                }))}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilters.distance === option.key && styles.selectedFilterOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => applyFilters(selectedFilters)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  listContent: {
    padding: 16,
  },
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  capacityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capacityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resourceAddress: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  resourcePhone: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  resourceHours: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  resourceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  directionsButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxWidth: 400,
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  filterOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  selectedFilterOption: {
    backgroundColor: COLORS.light,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedFilterOptionText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 0.45,
    backgroundColor: COLORS.textLight,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButton: {
    flex: 0.45,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ResourceScreen;