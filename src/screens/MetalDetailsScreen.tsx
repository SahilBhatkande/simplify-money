import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MetalsAPI } from '../services/api';
import { MetalDetails, MetalType } from '../types';

interface MetalDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      metalType: MetalType;
    };
  };
}

export const MetalDetailsScreen: React.FC<MetalDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { metalType } = route.params;
  const [metalDetails, setMetalDetails] = useState<MetalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetalDetails();
  }, [metalType]);

  const fetchMetalDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const details = await MetalsAPI.getMetalDetails(metalType);
      setMetalDetails(details);
    } catch (err) {
      console.error('Error fetching metal details:', err);
      setError('Failed to load metal details');
    } finally {
      setLoading(false);
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    }
    return formatPrice(marketCap);
  };

  const getMetalColor = (metalName: string) => {
    switch (metalName.toLowerCase()) {
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      case 'platinum':
        return '#E5E4E2';
      case 'palladium':
        return '#CED0DD';
      default:
        return '#FFD700';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading {metalType} details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !metalDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load details'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMetalDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.metalHeader}>
            <View style={[styles.metalIcon, { backgroundColor: getMetalColor(metalDetails.metal) }]} />
            <Text style={styles.metalName}>{metalDetails.metal}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>{formatPrice(metalDetails.currentPrice)}</Text>
          <Text style={styles.unit}>{metalDetails.unit}</Text>
          <Text
            style={[
              styles.changeText,
              { color: metalDetails.change24h >= 0 ? '#4CAF50' : '#F44336' },
            ]}
          >
            {formatChange(metalDetails.change24h, metalDetails.changePercent24h)}
          </Text>
          <Text style={styles.timestamp}>
            Last updated: {formatTime(metalDetails.timestamp)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Data</Text>
          
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Previous Close</Text>
              <Text style={styles.dataValue}>{formatPrice(metalDetails.previousClose)}</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Previous Open</Text>
              <Text style={styles.dataValue}>{formatPrice(metalDetails.previousOpen)}</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>24h High</Text>
              <Text style={styles.dataValue}>{formatPrice(metalDetails.high24h)}</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>24h Low</Text>
              <Text style={styles.dataValue}>{formatPrice(metalDetails.low24h)}</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>24h Volume</Text>
              <Text style={styles.dataValue}>{formatVolume(metalDetails.volume24h)}</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Market Cap</Text>
              <Text style={styles.dataValue}>{formatMarketCap(metalDetails.marketCap)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metal Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Purity</Text>
            <Text style={styles.infoValue}>{metalDetails.purity}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Currency</Text>
            <Text style={styles.infoValue}>{metalDetails.currency}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDate(metalDetails.timestamp)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {metalDetails.metal}</Text>
          <Text style={styles.description}>{metalDetails.description}</Text>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  metalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  metalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  unit: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  changeText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  footer: {
    height: 20,
  },
});

