import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PersonaliaView({ bruker, token, setAktivSkjerm, handterPlussKnapp, aktivAvdeling }: any) {
  const [ferskBruker, setFerskBruker] = useState<any>(bruker);
  const [laster, setLaster] = useState(true);

  useEffect(() => {
    hentFerskProfilData();
  }, []);

  const hentFerskProfilData = async () => {
    try {
      setLaster(true);
      const response = await fetch('https://api.cutcount.no/api/me', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFerskBruker(data.bruker || data.user || data);
      }
    } catch (error) {
      console.log('Nettverksfeil ved oppdatering av profil:', error);
    } finally {
      setLaster(false);
    }
  };

  const brukerData = ferskBruker || bruker;

  // Navn og e-post
  const fulltNavn = brukerData?.navn || brukerData?.name || brukerData?.full_navn || 'Ansatt';
  const epost = brukerData?.email || brukerData?.epost || '';

  // Avdelinger
  const avdelingerListe = brukerData?.avdelinger || (aktivAvdeling ? [aktivAvdeling] : []);

  // Lønnsmodell og satser
  const lonnsmodell = brukerData?.lonnsmodell || 'fastlonn';
  const timelonn = brukerData?.timelonn || '0';
  const provisjonKlipp = brukerData?.provisjon_prosent || brukerData?.tjeneste_prosent || '0';
  const minsteDagslonn = brukerData?.minste_dagslonn || '0';
  const tipsSats = (brukerData?.tips_prosent ?? '100') + '%';

  // LOGIKK FOR PRODUKTSALG: Sjekker om det er fastbeløp eller prosent
  const erFastbelop = brukerData?.produkt_provisjon_type === 'fastbelop';
  const provisjonSalg = erFastbelop
    ? `${brukerData?.produkt_fastbelop || 0} kr pr stk`
    : `${brukerData?.produkt_prosent ?? brukerData?.produktsalg_provisjon ?? 10}%`;

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
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Personalia</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setAktivSkjerm('PROFIL')} 
          className="w-10 h-10 rounded-full bg-[#E5E5E4] border-2 border-[#111827] shadow-sm overflow-hidden"
        >
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} className="w-full h-full" />
        </TouchableOpacity>
      </View>

      {/* INNHOLD */}
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* BRUKERPROFIL KORT */}
        <View className="bg-white border border-[#DCDCDA] rounded-[24px] p-6 mb-6 shadow-sm flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-[#E5E5E4] border-2 border-[#111827] overflow-hidden">
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} className="w-full h-full" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-black text-[#111827]">{fulltNavn}</Text>
            {epost ? <Text className="text-xs font-medium text-gray-500 mt-0.5">{epost}</Text> : null}
          </View>
        </View>

        {/* AVDELINGER */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Registrerte avdelinger</Text>
          {laster && <ActivityIndicator size="small" color="#111827" />}
        </View>

        <View className="bg-white border border-[#DCDCDA] rounded-[20px] p-4 mb-6 shadow-sm flex-col gap-2">
          {avdelingerListe.length > 0 ? (
            avdelingerListe.map((avd: any, idx: number) => {
              const avdNavn = typeof avd === 'string' ? avd : (avd?.navn || avd?.name || 'Salong');
              return (
                <View key={idx} className="flex-row items-center gap-3 py-1.5 border-b border-gray-50 last:border-b-0">
                  <Text className="text-lg">📍</Text>
                  <Text className="font-bold text-[#111827] text-sm">{avdNavn}</Text>
                </View>
              );
            })
          ) : (
            <View className="flex-row items-center gap-3 py-1">
              <Text className="text-lg">📍</Text>
              <Text className="font-bold text-[#111827] text-sm">Ingen ekstra avdelinger tildelt</Text>
            </View>
          )}
        </View>

        {/* LØNN OG VILKÅR */}
        <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">Lønn og provisjon</Text>
        <View className="bg-white border border-[#DCDCDA] rounded-[24px] p-5 mb-6 shadow-sm flex-col gap-4">
          
          {/* Viser enten Timelønn eller Klipp-provisjon basert på lønnsmodell */}
          {lonnsmodell === 'provisjon' || lonnsmodell === 'provisjon_garanti' ? (
            <View className="flex-row justify-between items-center pb-3 border-b border-gray-100">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">✂️</Text>
                <Text className="text-sm font-bold text-[#111827]">Tjenesteprovisjon</Text>
              </View>
              <Text className="text-base font-black text-[#111827]">{provisjonKlipp}%</Text>
            </View>
          ) : (
            <View className="flex-row justify-between items-center pb-3 border-b border-gray-100">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">💰</Text>
                <Text className="text-sm font-bold text-[#111827]">Timelønn</Text>
              </View>
              <Text className="text-base font-black text-[#111827]">{timelonn} kr/t</Text>
            </View>
          )}

          {lonnsmodell === 'provisjon_garanti' && (
            <View className="flex-row justify-between items-center pb-3 border-b border-gray-100">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">🛡️</Text>
                <Text className="text-sm font-bold text-[#111827]">Minste dagslønn</Text>
              </View>
              <Text className="text-base font-black text-[#111827]">{minsteDagslonn} kr/dag</Text>
            </View>
          )}

          {/* PRODUKTSALG - Viser nå 'X kr pr stk' hvis det er fastbeløp */}
          <View className="flex-row justify-between items-center pb-3 border-b border-gray-100">
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">🛍️</Text>
              <Text className="text-sm font-bold text-[#111827]">Produktsalg</Text>
            </View>
            <Text className="text-base font-black text-[#111827]">{provisjonSalg}</Text>
          </View>

          {/* TIPS */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">🪙</Text>
              <Text className="text-sm font-bold text-[#111827]">Tips-andel</Text>
            </View>
            <Text className="text-base font-black text-[#111827]">{tipsSats}</Text>
          </View>

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