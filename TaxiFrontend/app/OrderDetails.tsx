import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchOrderById } from '../lib/api';

const OrderDetailsScreen = ({
  orderId,
  onCallDriver,
  onHelp,
  onSendReceipt,
  onDelete,
  visible,
  onClose,
}) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;

    setLoading(true);
    fetchOrderById(orderId)
      .then((data) => {
        setOrderData(data);
      })
      .catch((error) => {
        console.error('Failed to load order:', error);
      })
      .finally(() => setLoading(false));
  }, [orderId, visible]);

  const processSegments = (segments) => {
    if (!segments || segments.length === 0) return [];

    const driversMap = new Map();
    
    segments.forEach(segment => {
      const driverId = segment.driver?.id || 'unknown';
      if (!driversMap.has(driverId)) {
        driversMap.set(driverId, {
          driver: segment.driver,
          vehicle: segment.vehicle,
          segments: [segment]
        });
      } else {
        driversMap.get(driverId).segments.push(segment);
      }
    });

    return Array.from(driversMap.values());
  };

  const driverGroups = processSegments(orderData?.segments || []);

  const handleCallDriver = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('Номер не указан', 'Контактный номер водителя отсутствует');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Детали заказа</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4E8AF4" />
            <Text style={styles.loadingText}>Загрузка данных заказа...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
          >
            {driverGroups.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.driverGroup}>
                {/* Driver Card */}
                <View style={styles.driverCard}>
                  <Image
                    source={{ uri: group.driver?.avatarUrl || 'https://via.placeholder.com/100' }}
                    style={styles.avatar}
                  />
                  
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>
                      {group.driver?.firstName ?? ''} {group.driver?.lastName ?? ''}
                    </Text>
                    
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={16} color="#FFC107" />
                      <Text style={styles.ratingText}>
                        {group.driver?.rating?.toFixed(1) ?? '5.0'}
                      </Text>
                    </View>
                    
                    <View style={styles.vehicleInfo}>
                      <FontAwesome5 name="car" size={14} color="#666" />
                      <Text style={styles.vehicleText}>
                        {group.vehicle?.brand} {group.vehicle?.model} • {group.vehicle?.licensePlate}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.driverActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleCallDriver(group.driver?.phoneNumber)}
                    >
                      <MaterialIcons name="phone" size={24} color="#4E8AF4" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={onHelp}
                    >
                      <MaterialIcons name="chat" size={24} color="#4E8AF4" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Vehicle Details */}
                {/* {group.vehicle?.specialEquipment && (
                  <View style={styles.specialEquipment}>
                    <Text style={styles.specialEquipmentText}>
                      <MaterialIcons name="build" size={14} color="#4E8AF4" />{' '}
                      {group.vehicle.specialEquipment}
                    </Text>
                  </View>
                )} */}

                {/* Route Segments */}
                {group.segments.map((segment, segmentIndex) => (
                  <View key={segmentIndex} style={styles.segmentContainer}>
                    <View style={styles.routePoint}>
                      <View style={styles.pointMarkerStart}>
                        <MaterialIcons name="location-on" size={16} color="#4CAF50" />
                      </View>
                      <View style={styles.routePointDetails}>
                        <Text style={styles.routePointLabel}>Откуда</Text>
                        <Text style={styles.routePointAddress}>{segment.fromAddress?.fullAddress}</Text>
                        {segment.departureTime && (
                          <Text style={styles.routePointTime}>
                            <MaterialIcons name="access-time" size={12} color="#666" />{' '}
                            {new Date(segment.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.routeDivider}>
                      <View style={styles.routeLine} />
                      <Text style={styles.routeDuration}>
                        {segment.departureTime && segment.arrivalTime && 
                          `${Math.ceil((new Date(segment.arrivalTime).getTime() - new Date(segment.departureTime).getTime()) / 60000)} мин`}
                      </Text>
                    </View>
                    
                    <View style={styles.routePoint}>
                      <View style={styles.pointMarkerEnd}>
                        <MaterialIcons name="location-on" size={16} color="#F44336" />
                      </View>
                      <View style={styles.routePointDetails}>
                        <Text style={styles.routePointLabel}>Куда</Text>
                        <Text style={styles.routePointAddress}>{segment.toAddress?.fullAddress}</Text>
                        {segment.arrivalTime && (
                          <Text style={styles.routePointTime}>
                            <MaterialIcons name="access-time" size={12} color="#666" />{' '}
                            {new Date(segment.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}

            {/* Footer Actions */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.footerButton, styles.primaryButton]}
                onPress={onSendReceipt}
              >
                <MaterialIcons name="email" size={20} color="#FFF" />
                <Text style={styles.footerButtonTextPrimary}>Отправить отчёт</Text>
              </TouchableOpacity>
              
              <View style={styles.secondaryActions}>
                <TouchableOpacity 
                  style={[styles.footerButton, styles.secondaryButton]}
                  onPress={onDelete}
                >
                  <MaterialIcons name="delete" size={20} color="#F44336" />
                  <Text style={styles.footerButtonTextSecondary}>Удалить</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.footerButton, styles.secondaryButton]}
                >
                  <MaterialIcons name="receipt" size={20} color="#4E8AF4" />
                  <Text style={styles.footerButtonTextSecondary}>Чек</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  container: {
    flex: 1,
  },
  driverGroup: {
    marginBottom: 8,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#E0E0E0',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  driverActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  specialEquipment: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  specialEquipmentText: {
    fontSize: 14,
    color: '#4E8AF4',
    backgroundColor: '#EDF3FE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  routePoint: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pointMarkerStart: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  pointMarkerEnd: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  routePointDetails: {
    flex: 1,
  },
  routePointLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  routePointAddress: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  routePointTime: {
    fontSize: 12,
    color: '#666',
  },
  routeDivider: {
    marginLeft: 12,
    marginBottom: 8,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 11,
  },
  routeDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4E8AF4',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  footerButtonTextPrimary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footerButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default OrderDetailsScreen;