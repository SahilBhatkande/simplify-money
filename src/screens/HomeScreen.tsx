import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MetalCard } from '../components/MetalCard';
import { MetalsAPI } from '../services/api';
import { MetalPrice, MetalType } from '../types';

const { height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [metals, setMetals] = useState<MetalPrice[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    gold: true,
    silver: true,
    platinum: true,
    palladium: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const fetchMetalPrice = async (metal: MetalType) => {
    setLoadingStates(prev => ({ ...prev, [metal]: true }));
    
    try {
      const price = await MetalsAPI.getMetalPrice(metal);
      setMetals(prev => {
        const existing = prev.find(m => m.metal.toLowerCase() === metal);
        if (existing) {
          return prev.map(m => m.metal.toLowerCase() === metal ? price : m);
        }
        return [...prev, price];
      });
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${metal} price:`, err);
      setError(`Failed to load ${metal} price`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [metal]: false }));
    }
  };

  const fetchAllMetals = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      const allPrices = await MetalsAPI.getAllMetalPrices();
      setMetals(allPrices);
      setLoadingStates({
        gold: false,
        silver: false,
        platinum: false,
        palladium: false,
      });
    } catch (err) {
      console.error('Error fetching all metals:', err);
      setError('Failed to load metal prices');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllMetals();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMetalPress = (metal: MetalPrice) => {
    const metalType = metal.metal.toLowerCase() as MetalType;
    navigation.navigate('MetalDetails', { metalType });
  };

  const onRefresh = () => {
    fetchAllMetals();
  };

  const getMetalForDisplay = (metalName: string): MetalPrice => {
    const found = metals.find(m => m.metal.toLowerCase() === metalName.toLowerCase());
    if (found) return found;
    
    return {
      metal: metalName,
      price: 0,
      currency: 'USD',
      unit: 'per troy ounce',
      timestamp: new Date().toISOString(),
      change24h: 0,
      changePercent24h: 0,
      previousClose: 0,
      previousOpen: 0,
      high24h: 0,
      low24h: 0,
      volume24h: 0,
    };
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1, minHeight: height + 200 }
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
      >
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>Precious Metals</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{getCurrentTime()}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Live Market Prices</Text>
            <Text style={styles.description}>
              Real-time prices for 24 Karat precious metals
            </Text>
          </View>
        </LinearGradient>

        {error && (
          <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <MetalCard
            metal={getMetalForDisplay('Gold')}
            onPress={() => handleMetalPress(getMetalForDisplay('Gold'))}
            isLoading={loadingStates.gold}
          />
          
          <MetalCard
            metal={getMetalForDisplay('Silver')}
            onPress={() => handleMetalPress(getMetalForDisplay('Silver'))}
            isLoading={loadingStates.silver}
          />
          
          <MetalCard
            metal={getMetalForDisplay('Platinum')}
            onPress={() => handleMetalPress(getMetalForDisplay('Platinum'))}
            isLoading={loadingStates.platinum}
          />
          
          <MetalCard
            metal={getMetalForDisplay('Palladium')}
            onPress={() => handleMetalPress(getMetalForDisplay('Palladium'))}
            isLoading={loadingStates.palladium}
          />
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Market Information</Text>
            <Text style={styles.footerText}>
              Prices are updated in real-time from global markets
            </Text>
            <Text style={styles.footerText}>
              All prices shown are for 24 Karat purity (99.9%)
            </Text>
            <Text style={styles.footerText}>
              Data sourced from reliable market APIs
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 120,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
});

