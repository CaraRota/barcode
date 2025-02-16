import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Image, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  permalink: string;
}

const BarcodeScannerScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const searchProductByBarcode = async (barcode: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search`, {
        params: {
          q: barcode,
          limit: 10
        }
      });

      if (response.data.results.length > 0) {
        setProducts(response.data.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
          permalink: item.permalink
        })));
      } else {
        Alert.alert('No Products Found', 'No products found for this barcode.');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      Alert.alert('Search Error', 'Unable to search for products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    searchProductByBarcode(data);
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        // Open product link in browser
      }}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.productImage} 
        resizeMode="contain"
      />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>
          ${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.rescanButton}>
          <Text style={styles.rescanButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        />
      ) : (
        <View style={styles.resultsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : (
            <FlatList
              data={products}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.productList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text>No products found</Text>
                </View>
              }
            />
          )}
          <TouchableOpacity 
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanButtonText}>Scan Another Barcode</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    padding: 10,
  },
  productList: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productDetails: {
    marginTop: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
  },
  rescanButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  rescanButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default BarcodeScannerScreen;
