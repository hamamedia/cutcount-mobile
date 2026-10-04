import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function VelgSalongView({ bruker, bekreftManueltSalongValg }: any) {
  return (
    <View className="flex-1 bg-[#F7F7F6] pt-24 px-6">
      <View className="mb-10 items-center">
        <View className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
          <Feather name="alert-triangle" size={32} color="#ef4444" />
        </View>
        <Text className="text-3xl font-black text-[#111827] tracking-tight mb-2 text-center">Ingen vakt funnet</Text>
        <Text className="text-base text-gray-500 text-center px-4 leading-relaxed">
          Vi kunne ikke finne en planlagt vakt for deg i dag. Hvor skal du jobbe?
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {bruker?.avdelinger?.map((avd: any) => (
          <TouchableOpacity 
            key={avd.id} 
            activeOpacity={0.7}
            onPress={() => bekreftManueltSalongValg(avd)}
            className="flex-row items-center bg-white p-5 rounded-[24px] border border-[#DCDCDA] shadow-sm"
          >
            <View className="w-12 h-12 rounded-full bg-[#d1fae5] border border-[#34d399] items-center justify-center mr-4">
              <Feather name="map-pin" size={20} color="#065f46" />
            </View>
            <Text className="text-xl font-bold text-[#111827] flex-1">{avd.navn}</Text>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}