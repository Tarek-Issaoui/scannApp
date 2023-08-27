import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, Linking, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from "axios"
import { StatusBar } from 'expo-status-bar';
import BarcodeMask from 'react-native-barcode-mask';
const height=Dimensions.get('screen').height/2
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [informations,setInformations]=useState(null)
  console.log(informations)
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);
  
  const handleClick=(data)=>setTimeout(() => Linking.openURL(data),300)
  const handleBarCodeScanned = async({ type, data }) => {
    // if you want to use the information from a defined API in another component in the app
    if(!scanned){
      try {
        const res=await axios.get(data)
        // store the information of the QRcode inside the app
        setInformations(res?.data)
      } catch (error) {
        console.log(error)
      }
      setScanned(true);
      // visit the URL of the QRcode 
      handleClick(data)
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.text}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine={false}/>
      </BarCodeScanner>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    <StatusBar style='auto'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:"center"
  },
  text:{
    paddingTop:height,
    justifyContent: 'center',
    alignItems:"center"
  }
});



