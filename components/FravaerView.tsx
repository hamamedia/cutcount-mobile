import { Feather } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function FravaerView({ setAktivSkjerm, handterPlussKnapp }: any) {
  return (
    <View className="flex-1 bg-[#F7F7F6]">
      {/* HEADER MED TILBAKE-KNAPP */}
      <View className="pt-16 px-6 pb-4 flex-row items-center justify-between relative z-10 border-b border-[#E5E5E4] bg-[#F7F7F6]">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => setAktivSkjerm('DASHBOARD')} 
            className="w-12 h-12 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm"
          >
            <Feather name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Fravær</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setAktivSkjerm('PROFIL')} 
          className="w-10 h-10 rounded-full bg-[#E5E5E4] border-2 border-[#111827] shadow-sm overflow-hidden"
        >
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} className="w-full h-full" />
        </TouchableOpacity>
      </View>

      {/* INNHOLD */}
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Info-bokser i Grid */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-white border border-[#DCDCDA] rounded-[24px] p-5 shadow-sm">
            <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Feriesaldo</Text>
            <Text className="text-3xl font-black text-[#111827] mt-2">14 <Text className="text-base font-semibold text-gray-500">dg</Text></Text>
            <Text className="text-[10px] text-green-600 font-bold mt-2">Tilgjengelig</Text>
          </View>
          
          <View className="flex-1 bg-white border border-[#DCDCDA] rounded-[24px] p-5 shadow-sm">
            <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Egenmelding</Text>
            <Text className="text-3xl font-black text-[#111827] mt-2">3 <Text className="text-base font-semibold text-gray-500">brukt</Text></Text>
            <Text className="text-[10px] text-gray-500 font-bold mt-2">Siste 12 mnd</Text>
          </View>
        </View>

        <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">Registrert fravær</Text>
        
        {/* Liste med fravær */}
        <View className="flex-col gap-3">
          {/* Sommerferie */}
          <View className="flex-row justify-between items-center p-4 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Text className="text-xl">☀️</Text>
              </View>
              <View>
                <Text className="text-sm font-bold text-[#111827]">Sommerferie</Text>
                <Text className="text-xs text-gray-500 mt-0.5">Uke 28 - 30</Text>
              </View>
            </View>
            <View className="bg-[#F7F7F6] border border-[#DCDCDA] rounded-lg px-3 py-1.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-[#111827]">15 dg</Text>
            </View>
          </View>
          
          {/* Sykdom */}
          <View className="flex-row justify-between items-center p-4 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Text className="text-xl">🤒</Text>
              </View>
              <View>
                <Text className="text-sm font-bold text-[#111827]">Sykdom (Ringt inn)</Text>
                <Text className="text-xs text-gray-500 mt-0.5">2. august</Text>
              </View>
            </View>
            <View className="bg-[#F7F7F6] border border-[#DCDCDA] rounded-lg px-3 py-1.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-[#111827]">1 dg</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BUNNMENY MED KUN 3 KNAPPER */}
      <View className="absolute bottom-0 w-full h-[85px] bg-[#F7F7F6]/95 border-t border-[#E5E5E4] flex-row justify-around items-start pt-4 px-8 z-50">
        <TouchableOpacity 
          className="flex-col items-center gap-1 w-16 opacity-40 text-[#111827]" 
          onPress={() => setAktivSkjerm('DASHBOARD')}
        >
          <Feather name="home" size={24} color="#111827" />
          <Text className="text-[9px] font-bold tracking-widest uppercase mt-1">Hjem</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handterPlussKnapp} 
          className="relative -top-7 w-16 h-16 bg-[#111827] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F7F7F6]"
        >
          <Feather name="plus" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-col items-center gap-1 w-16 opacity-40 text-[#111827]" 
          onPress={() => setAktivSkjerm('MIN_SIDE')}
        >
          <Feather name="pie-chart" size={24} color="#111827" />
          <Text className="text-[8px] font-bold tracking-widest uppercase mt-1 whitespace-nowrap">Økonomi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}