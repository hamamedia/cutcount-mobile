import { Feather } from '@expo/vector-icons';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function KameraView({ setAktivSkjerm, utforQRStempling, laster, erStempletInn }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannet, setScannet] = useState(false);

  // Venter på at systemet skal sjekke tillatelser
  if (!permission) {
    return (
      <View className="flex-1 bg-[#F7F7F6] justify-center items-center">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  // Hvis brukeren ikke har gitt tilgang til kameraet enda
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-[#F7F7F6] px-6 items-center justify-center">
        <View className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <Feather name="camera-off" size={40} color="#111827" />
        </View>
        <Text className="text-2xl font-black text-[#111827] text-center mb-2">Kameratilgang</Text>
        <Text className="text-gray-500 text-center mb-8 px-4">
          Vi trenger tilgang til kameraet for at du skal kunne scanne QR-koden i salongen.
        </Text>
        <TouchableOpacity 
          className="bg-[#111827] py-4 px-10 rounded-[24px] shadow-sm"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-lg">Gi tilgang</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-6" onPress={() => setAktivSkjerm('DASHBOARD')}>
          <Text className="text-gray-500 font-bold">Avbryt</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Når kameraet scanner en QR-kode
  const handterQR = ({ data }: any) => {
    if (!scannet) {
      setScannet(true);
      utforQRStempling(data); // <-- Sender QR-innholdet videre!
    }
  };

  return (
    <View className="flex-1 bg-[#F7F7F6]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center bg-[#F7F7F6] z-10">
        <TouchableOpacity 
          className="w-10 h-10 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm mr-4"
          onPress={() => setAktivSkjerm('DASHBOARD')}
        >
          <Feather name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        
        {/* DYNAMISK TEKST: Viser Sjekk ut hvis du er på jobb, ellers Sjekk inn */}
        <Text className="font-black text-2xl tracking-tighter text-[#111827]">
          {erStempletInn ? 'Sjekk ut' : 'Sjekk inn'}
        </Text>
      </View>

      <View className="flex-1 px-6 items-center justify-center pb-20">
        <Text className="text-gray-500 text-center mb-8 font-medium">
          {erStempletInn 
            ? 'Hold mobilkameraet over QR-koden i kassen for å stemple ut og avslutte vakten.' 
            : 'Hold mobilkameraet over QR-koden i kassen for å stemple inn.'}
        </Text>
        
        <View className="w-full aspect-square rounded-[40px] overflow-hidden border-4 border-[#111827] shadow-lg relative bg-black">
          {laster ? (
            <View className="flex-1 bg-white items-center justify-center">
              <ActivityIndicator size="large" color="#111827" />
              <Text className="mt-4 font-bold text-[#111827] tracking-widest uppercase text-xs">
                {erStempletInn ? 'Stempler ut...' : 'Stempler inn...'}
              </Text>
            </View>
          ) : (
            <ExpoCameraView
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={scannet ? undefined : handterQR}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}