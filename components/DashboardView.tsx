import { Feather } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardView({ bruker, aktivAvdeling, setAktivSkjerm, handterPlussKnapp, erStempletInn }: any) {
  // Henter fornavn fra bruker-objektet uavhengig av om backend bruker 'navn', 'name', 'fornavn' eller 'full_navn'
  const fulltNavn = bruker?.navn || bruker?.name || bruker?.fornavn || bruker?.full_navn || '';
  const fornavn = fulltNavn ? fulltNavn.split(' ')[0] : '';

  // DYNAMISKE BEREGNINGER
  const dagensSalg = Number(bruker?.dagens_salg || bruker?.salg_i_dag || 0);
  
  // Provisjonsberegning (sjekker om bruker har spesifisert provisjon eller berregner ut fra sats)
  const provisjonSats = Number(bruker?.provisjon_prosent || bruker?.provisjon || 20); // 20% standard hvis udefinert
  const dinProvisjon = bruker?.din_provisjon !== undefined 
    ? Number(bruker?.din_provisjon) 
    : Math.round((dagensSalg * provisjonSats) / 100);

  return (
    <View className="flex-1 bg-[#F7F7F6]">
      
      {/* HEADER MED GLOBAL SJEKK UT-KNAPP */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-[#F7F7F6] z-10">
        <Text className="font-black text-2xl tracking-tighter text-[#111827]">CUT & COUNT</Text>
        
        <View className="flex-row items-center gap-3">
          {erStempletInn && (
            <TouchableOpacity 
              onPress={() => setAktivSkjerm('KAMERA')}
              className="flex-row items-center gap-1.5 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm"
            >
              <Feather name="log-out" size={14} color="#111827" />
              <Text className="text-xs font-bold text-[#111827]">Sjekk ut</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => setAktivSkjerm('PROFIL')}
            className="w-10 h-10 rounded-full bg-[#E5E5E4] border-2 border-[#111827] shadow-sm overflow-hidden"
          >
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} className="w-full h-full" />
          </TouchableOpacity>
        </View>
      </View>

      {/* INNHOLD */}
      <ScrollView className="flex-1 px-6 mt-2" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Total oversikt</Text>
        <Text className="text-3xl font-black text-[#111827] tracking-tight">
          Hei{fornavn ? `, ${fornavn}` : ''} 👋
        </Text>
        
        {/* DYNAMISK INNSJEKK-BOKS */}
        <View className="bg-white border border-[#DCDCDA] rounded-[24px] p-6 mt-6 shadow-sm">
          
          {erStempletInn ? (
            <View className="items-center py-4">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <Text className="text-[10px] font-bold tracking-widest text-green-600 uppercase">
                  Aktiv vakt
                </Text>
              </View>
              <Text className="text-2xl font-black text-[#111827] mt-1 mb-2 text-center">
                {aktivAvdeling?.navn}
              </Text>
              <Text className="text-sm font-medium text-gray-500 text-center">
                Kassen er åpen og klar for salg.
              </Text>
            </View>
          ) : (
            <View className="items-center relative py-2">
              {aktivAvdeling && (
                <TouchableOpacity 
                  onPress={() => setAktivSkjerm('VELG_SALONG')}
                  className="absolute right-0 top-0 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  <Text className="text-[10px] font-bold text-gray-700 uppercase">Bytt</Text>
                </TouchableOpacity>
              )}

              <View className="flex-row items-center gap-1.5 mb-2">
                <Feather name="map-pin" size={16} color={aktivAvdeling ? "#111827" : "#9ca3af"} />
                <Text className={`text-base font-bold ${aktivAvdeling ? 'text-[#111827]' : 'text-gray-400'}`}>
                  {aktivAvdeling ? aktivAvdeling.navn : 'Ingen valgt'}
                </Text>
              </View>
              
              <Text className="text-2xl font-black text-[#111827] mt-2 mb-8">
                Klar for innsjekk?
              </Text>

              {aktivAvdeling ? (
                <TouchableOpacity 
                  onPress={() => setAktivSkjerm('KAMERA')} 
                  className="w-full bg-[#111827] py-3.5 rounded-[16px] items-center"
                >
                  <Text className="text-white font-bold tracking-widest uppercase text-xs">Skann QR for å starte</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  onPress={() => setAktivSkjerm('VELG_SALONG')} 
                  className="w-full bg-blue-50 py-3.5 rounded-[16px] border border-blue-100 items-center"
                >
                  <Text className="text-blue-600 font-bold tracking-widest uppercase text-xs">Velg salong først</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

        </View>

        {/* Økonomi / Dagens tall (DYNAMISKE TALL) */}
        <View className="flex-row gap-4 mt-4">
          <View className="flex-1 bg-[#111827] rounded-[24px] p-5 shadow-sm">
            <Text className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Dagens salg</Text>
            <Text className="text-2xl font-black text-white mt-2">
              {dagensSalg > 0 ? `${dagensSalg.toLocaleString('no-NO')},-` : '0,-'}
            </Text>
          </View>

          <View className="flex-1 bg-white border border-[#DCDCDA] rounded-[24px] p-5 shadow-sm">
            <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Din provisjon</Text>
            <Text className="text-2xl font-black text-[#111827] mt-2">
              {dinProvisjon > 0 ? `${dinProvisjon.toLocaleString('no-NO')},-` : '0,-'}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* NY, STØRRE OG MER TYDELIG BUNNMENY */}
      <View className="absolute bottom-0 w-full h-[90px] bg-white border-t border-[#DCDCDA] flex-row justify-around items-start pt-3 px-6 z-50 shadow-lg">
        
        {/* HJEM */}
        <TouchableOpacity 
          className="flex-col items-center justify-center gap-1 w-20 active:opacity-70" 
          onPress={() => setAktivSkjerm('DASHBOARD')}
        >
          <Feather name="home" size={26} color="#111827" />
          <Text className="text-[11px] font-black tracking-wider uppercase text-[#111827] mt-0.5">
            Hjem
          </Text>
        </TouchableOpacity>

        {/* PLUSS-KNAPP */}
        <TouchableOpacity 
          onPress={handterPlussKnapp} 
          activeOpacity={0.85}
          className="relative -top-8 w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center border-4 border-[#F7F7F6] active:scale-95 transition-all"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <Feather name="plus" size={34} color="white" />
        </TouchableOpacity>

        {/* ØKONOMI */}
        <TouchableOpacity 
          className="flex-col items-center justify-center gap-1 w-20 active:opacity-70" 
          onPress={() => setAktivSkjerm('MIN_SIDE')}
        >
          <Feather name="pie-chart" size={26} color="#111827" />
          <Text className="text-[11px] font-black tracking-wider uppercase text-[#111827] mt-0.5 whitespace-nowrap">
            Økonomi
          </Text>
        </TouchableOpacity>
        
      </View>

    </View>
  );
}