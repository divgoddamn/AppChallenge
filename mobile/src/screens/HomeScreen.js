import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS, RESOURCE_TYPES } from '../constants';

const HomeScreen = ({ navigation }) => {
  const resourceTypes = [
    { id: 1, name: 'Shelter', type: RESOURCE_TYPES.SHELTER, icon: '🏢' },
    { id: 2, name: 'Food Programs', type: RESOURCE_TYPES.FOOD, icon: '🍎' },
    { id: 3, name: 'Health Care', type: RESOURCE_TYPES.HEALTH, icon: '🏥' },
    { id: 4, name: 'Job Opportunities', type: RESOURCE_TYPES.JOB, icon: '💼' },
    { id: 5, name: 'Education', type: RESOURCE_TYPES.EDUCATION, icon: '🎓' },
    { id: 6, name: 'Rehabilitation', type: RESOURCE_TYPES.REHAB, icon: '💪' },
  ];

  const handleResourcePress = (resourceType) => {
    navigation.navigate('Resources', { resourceType });
  };

  const handleChatPress = () => {
    navigation.navigate('Chat');
  };

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PathFinder</Text>
          <Text style={styles.subtitle}>Your Path to Stability</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.chatButton]} 
            onPress={handleChatPress}
          >
            <Text style={styles.actionButtonText}>💬 Speak to Assistant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.mapButton]} 
            onPress={handleMapPress}
          >
            <Text style={styles.actionButtonText}>📍 Find Resources Nearby</Text>
          </TouchableOpacity>
        </View>

        {/* Resource Categories */}
        <View style={styles.resourceSection}>
          <Text style={styles.sectionTitle}>Find Resources</Text>
          <View style={styles.resourceGrid}>
            {resourceTypes.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={styles.resourceCard}
                onPress={() => handleResourcePress(resource.type)}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{resource.icon}</Text>
                </View>
                <Text style={styles.resourceName}>{resource.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyText}>National Crisis Hotline: 988</Text>
            <Text style={styles.emergencyText}>National Runaway Safeline: 1-800-786-2929</Text>
            <Text style={styles.emergencyText}>National Domestic Violence: 1-800-799-7233</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: COLORS.primary,
  },
  mapButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resourceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  resourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resourceCard: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
  },
  resourceName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS.text,
  },
  emergencySection: {
    marginTop: 16,
  },
  emergencyCard: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emergencyText: {
    fontSize: 14,
    color: COLORS.danger,
    marginBottom: 8,
    fontWeight: '500',
  },
});

export default HomeScreen;