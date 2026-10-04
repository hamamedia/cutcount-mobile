import { Feather } from '@expo/vector-icons';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DokumenterView({ bruker, setAktivSkjerm, handterPlussKnapp }: any) {
  // Dynamiske data om dokumenter (kan kobles til backend)
  const dokumenter = bruker?.dokumenter || [];

  const handterSignering = (dokNavn: string) => {
    Alert.alert("Signering ✍️", `Åpner ${dokNavn} for signering.`);
  };

  return (
    <View className="flex-1 bg-[#F7F7F6]">
      
      {/* HEADER MED TILBAKE-KNAPP */}
      <View className="pt-16 px-6 pb-4 flex-row items-center justify-between relative z-10 border-b border-[#E5E5E4] bg-[#F7F7F6]">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => setAktivSkjerm('PROFIL')} 
            className="w-12 h-12 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm"
          >
            <Feather name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Dokumenter</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. TOPPKORT: STATUS */}
        <View className="bg-[#111827] rounded-[20px] p-4 mb-6 shadow-sm flex-col justify-between">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kontrakter & Arkiv</Text>
            <Text className="text-xl">📄</Text>
          </View>
          <Text className="text-2xl font-black text-white tracking-tight">Dine avtaler</Text>
          <Text className="text-[11px] text-gray-400 mt-1">Oversikt over signerte og ventende dokumenter.</Text>
        </View>

        {/* 2. DOKUMENTER SOM KREVER SIGNERING */}
        <View className="w-full bg-[#F7F7F6] py-1 mb-2">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Krever din signatur
          </Text>
        </View>

        <View className="bg-white border border-[#DCDCDA] rounded-[20px] p-4 mb-6 shadow-sm flex-col gap-3">
          {dokumenter.filter((d: any) => !d.signert).length > 0 ? (
            dokumenter.filter((d: any) => !d.signert).map((dok: any, idx: number) => (
              <View key={idx} className="flex-row justify-between items-center pb-2.5 border-b border-gray-100 last:border-b-0 last:pb-0">
                <View className="flex-1 mr-3">
                  <Text className="text-xs font-bold text-[#111827]">{dok.navn}</Text>
                  <Text className="text-[10px] text-gray-500">Mottatt: {dok.dato || 'Nylig'}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handterSignering(dok.navn)}
                  className="bg-[#111827] px-3 py-1.5 rounded-lg flex-row items-center gap-1"
                >
                  <Feather name="edit-3" size={12} color="white" />
                  <Text className="text-white text-[10px] font-bold">Signer</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="py-3 items-center">
              <Text className="text-xs font-semibold text-gray-500">Ingen dokumenter venter på signering ✅</Text>
            </View>
          )}
        </View>

        {/* 3. SIGNERTE DOKUMENTER (ARKIV) */}
        <View className="w-full bg-[#F7F7F6] py-1 mb-2">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Arkiv / Signerte avtaler
          </Text>
        </View>

        <View className="bg-white border border-[#DCDCDA] rounded-[20px] p-4 mb-6 shadow-sm flex-col gap-3">
          {dokumenter.filter((d: any) => d.signert).length > 0 ? (
            dokumenter.filter((d: any) => d.signert).map((dok: any, idx: number) => (
              <View key={idx} className="flex-row justify-between items-center pb-2.5 border-b border-gray-100 last:border-b-0 last:pb-0">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-[#111827]">{dok.navn}</Text>
                  <Text className="text-[10px] text-gray-500">Signert: {dok.signertDato || 'N/A'}</Text>
                </View>
                <Text className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  Signert
                </Text>
              </View>
            ))
          ) : (
            <View className="py-3 items-center">
              <Text className="text-xs font-semibold text-gray-400">Ingen signerte dokumenter i arkivet</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* BUNNMENY */}
      <View className="absolute bottom-0 w-full h-[90px] bg-white border-t border-[#DCDCDA] flex-row justify-around items-start pt-3 px-6 z-50 shadow-lg">
        <TouchableOpacity 
          className="flex-col items-center justify-center gap-1 w-20 active:opacity-70" 
          onPress={() => setAktivSkjerm('DASHBOARD')}
        >
          <Feather name="home" size={26} color="#111827" />
          <Text className="text-[11px] font-black tracking-wider uppercase text-[#111827] mt-0.5">Hjem</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handterPlussKnapp} 
          activeOpacity={0.85}
          className="relative -top-8 w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center border-4 border-[#F7F7F6] active:scale-95 transition-all"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 }}
        >
          <Feather name="plus" size={34} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-col items-center justify-center gap-1 w-20 active:opacity-70" 
          onPress={() => setAktivSkjerm('MIN_SIDE')}
        >
          <Feather name="pie-chart" size={26} color="#111827" />
          <Text className="text-[11px] font-black tracking-wider uppercase text-[#111827] mt-0.5 whitespace-nowrap">Økonomi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}