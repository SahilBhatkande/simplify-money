import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MetalPrice } from '../types';

const { width } = Dimensions.get('window');

interface MetalCardProps {
  metal: MetalPrice;
  onPress: () => void;
  isLoading?: boolean;
}

export const MetalCard: React.FC<MetalCardProps> = ({
  metal,
  onPress,
  isLoading = false,
}) => {
  const getMetalGradient = (metalName: string) => {
    switch (metalName.toLowerCase()) {
      case 'gold':
        return ['#FFD700', '#FFA500', '#FF8C00'];
      case 'silver':
        return ['#C0C0C0', '#A9A9A9', '#808080'];
      case 'platinum':
        return ['#E5E4E2', '#D3D3D3', '#C0C0C0'];
      case 'palladium':
        return ['#CED0DD', '#B8B8B8', '#A0A0A0'];
      default:
        return ['#FFD700', '#FFA500', '#FF8C00'];
    }
  };

  const getMetalIcon = (metalName: string) => {
    switch (metalName.toLowerCase()) {
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'platinum':
        return '💎';
      case 'palladium':
        return '🔶';
      default:
        return '🥇';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(change)} (${sign}${percent.toFixed(2)}%)`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={['#f8f9fa', '#e9ecef']}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading {metal.metal} price...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={getMetalGradient(metal.metal)}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.metalInfo}>
            <Text style={styles.metalIcon}>{getMetalIcon(metal.metal)}</Text>
            <View style={styles.metalTextContainer}>
              <Text style={styles.metalName}>{metal.metal}</Text>
              <Text style={styles.metalSubtitle}>24 Karat Pure</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timestamp}>{formatTime(metal.timestamp)}</Text>
          </View>
        </View>
        
        <View style={styles.priceSection}>
          <Text style={styles.price}>{formatPrice(metal.price)}</Text>
          <Text style={styles.unit}>{metal.unit}</Text>
        </View>
        
        <View style={styles.changeSection}>
          <View style={[
            styles.changeContainer,
            { backgroundColor: metal.change24h >= 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)' }
          ]}>
            <Text
              style={[
                styles.changeText,
                { color: metal.change24h >= 0 ? '#4CAF50' : '#F44336' },
              ]}
            >
              {formatChange(metal.change24h, metal.changePercent24h)}
            </Text>
          </View>
        </View>
        
        <View style={styles.purityContainer}>
          <View style={styles.purityBadge}>
            <Text style={styles.purityText}>99.9% Pure</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
  },
  loadingGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 140,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  metalTextContainer: {
    flex: 1,
  },
  metalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 2,
  },
  metalSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  timeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timestamp: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  priceSection: {
    marginBottom: 16,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  unit: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  changeSection: {
    marginBottom: 16,
  },
  changeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  purityContainer: {
    alignItems: 'flex-end',
  },
  purityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  purityText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

