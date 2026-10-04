import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MinSideView({ bruker, token, setAktivSkjerm, handterPlussKnapp, erStempletInn }: any) {
  
  const [okonomiData, setOkonomiData] = useState<any>(null);
  const [laster, setLaster] = useState(true);

  // Historikk-state
  const dagensDato = new Date();
  const [valgtMaaned, setValgtMaaned] = useState(dagensDato.getMonth() + 1);
  const [valgtAar, setValgtAar] = useState(dagensDato.getFullYear());

  const lonnsmodell = bruker?.lonnsmodell || 'provisjon'; 
  const erFastlonn = lonnsmodell === 'fastlonn';

  const maanedNavn = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
  const erNavaerendeMaaned = valgtMaaned === (dagensDato.getMonth() + 1) && valgtAar === dagensDato.getFullYear();

  useEffect(() => {
    const hentLonn = async () => {
      setLaster(true);
      try {
        const endpoint = erNavaerendeMaaned 
          ? 'https://api.cutcount.no/api/min-lonn' 
          : `https://api.cutcount.no/api/min-lonn/historikk?maaned=${valgtMaaned}&aar=${valgtAar}`;

        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOkonomiData(data);
        }
      } catch (error) {
        console.log("Nettverksfeil:", error);
      } finally {
        setLaster(false);
      }
    };

    hentLonn();
  }, [valgtMaaned, valgtAar]);

  const gaTilForrigeMaaned = () => {
    if (valgtMaaned === 1) {
      setValgtMaaned(12);
      setValgtAar(valgtAar - 1);
    } else {
      setValgtMaaned(valgtMaaned - 1);
    }
  };

  const gaTilNesteMaaned = () => {
    if (erNavaerendeMaaned) return; 
    if (valgtMaaned === 12) {
      setValgtMaaned(1);
      setValgtAar(valgtAar + 1);
    } else {
      setValgtMaaned(valgtMaaned + 1);
    }
  };

  const timerJobbet = okonomiData?.statistikk?.arbeidstimer || 0;
  const tipsTotalt = okonomiData?.statistikk?.tips_innsamlet_totalt || 0;
  const totalOmsetning = okonomiData?.statistikk?.brutto_omsetning || 0;
  const utbetaling = okonomiData?.opptjent_lonn?.total_brutto_utbetaling || 0;
  const venterPaaGodkjenning = okonomiData?.har_timer_til_godkjenning || false;

  return (
    <View className="flex-1 bg-[#F7F7F6]">
      
      {/* HEADER MED PROFILBILDE OG SJEKK UT */}
      <View className="pt-16 px-6 pb-4 flex-row items-center justify-between relative z-10 border-b border-[#E5E5E4] bg-[#F7F7F6]">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => setAktivSkjerm('DASHBOARD')} className="w-12 h-12 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm">
            <Feather name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Økonomi</Text>
        </View>

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
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* MÅNED-VELGER */}
        <View className="flex-row items-center justify-between bg-white rounded-full p-1.5 mb-6 shadow-sm border border-[#DCDCDA]">
          <TouchableOpacity onPress={gaTilForrigeMaaned} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Feather name="chevron-left" size={20} color="#111827" />
          </TouchableOpacity>
          
          <Text className="text-sm font-bold text-[#111827] uppercase tracking-widest">
            {maanedNavn[valgtMaaned - 1]} {valgtAar}
          </Text>

          <TouchableOpacity 
            onPress={gaTilNesteMaaned} 
            disabled={erNavaerendeMaaned}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${erNavaerendeMaaned ? 'opacity-20' : 'bg-gray-100'}`}
          >
            <Feather name="chevron-right" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        <View className="bg-[#111827] rounded-[24px] p-6 shadow-md mb-6 relative overflow-hidden">
          <View className="absolute -right-10 -top-10 opacity-10">
            <Feather name={erFastlonn ? 'clock' : 'trending-up'} size={150} color="white" />
          </View>
          
          <Text className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {erNavaerendeMaaned ? 'Estimert lønn' : 'Utbetalt lønn (brutto)'}
          </Text>
          
          <View className="flex-row items-end gap-2 mt-2">
            <Text className="text-4xl font-black text-white">
              {laster ? '...' : Math.round(utbetaling)}
            </Text>
            <Text className="text-lg font-bold text-gray-400 mb-1">NOK</Text>
          </View>

          <View className="mt-8">
            {erFastlonn ? (
              <View className="flex-col gap-2">
                <View className="flex-row justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                  <View className="flex-row items-center gap-2">
                    <Feather name="clock" size={16} color="#9ca3af" />
                    <Text className="text-xs font-medium text-gray-400">Timer jobbet:</Text>
                  </View>
                  <Text className="text-sm font-bold text-white">{laster ? '...' : timerJobbet} timer</Text>
                </View>
                
                {venterPaaGodkjenning && (
                  <View className="flex-row items-center gap-2 bg-yellow-500/20 p-3 rounded-xl border border-yellow-500/30 mt-1">
                    <Feather name="alert-circle" size={16} color="#fbbf24" />
                    <Text className="text-[10px] font-medium text-yellow-500 flex-1 leading-4">
                      Noen vakter mangler godkjenning fra leder. Timene oppdateres her så snart de er behandlet.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs font-medium text-gray-400">Neste bonusnivå (30k)</Text>
                  <Text className="text-xs font-bold text-white">0%</Text>
                </View>
                <View className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                  <View className="h-full bg-white rounded-full" style={{ width: '0%' }} />
                </View>
              </>
            )}
          </View>
        </View>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-white border border-[#DCDCDA] rounded-[20px] p-4 shadow-sm">
            <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Tips</Text>
            <Text className="text-xl font-black text-[#111827] mt-1">{laster ? '...' : Math.round(tipsTotalt)},-</Text>
          </View>
          <View className="flex-1 bg-white border border-[#DCDCDA] rounded-[20px] p-4 shadow-sm relative overflow-hidden">
            <View className="absolute -right-4 -bottom-4 opacity-5">
              <Feather name="trending-up" size={60} color="#111827" />
            </View>
            <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Din omsetning</Text>
            <Text className="text-xl font-black text-[#111827] mt-1">{laster ? '...' : Math.round(totalOmsetning)},-</Text>
          </View>
        </View>

      </ScrollView>

      {/* BUNNMENY MED KUN 3 KNAPPER */}
      <View className="absolute bottom-0 w-full h-[85px] bg-[#F7F7F6]/95 border-t border-[#E5E5E4] flex-row justify-around items-start pt-4 px-8 z-50">
        <TouchableOpacity className="flex-col items-center gap-1 w-16 opacity-40 text-[#111827]" onPress={() => setAktivSkjerm?.('DASHBOARD')}>
          <Feather name="home" size={24} color="#111827" />
          <Text className="text-[9px] font-bold tracking-widest uppercase mt-1">Hjem</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handterPlussKnapp} 
          className="relative -top-7 w-16 h-16 bg-[#111827] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F7F7F6]"
        >
          <Feather name="plus" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-col items-center gap-1 w-16 opacity-100 text-[#111827]" onPress={() => setAktivSkjerm?.('MIN_SIDE')}>
          <Feather name="pie-chart" size={24} color="#111827" />
          <Text className="text-[8px] font-bold tracking-widest uppercase mt-1 whitespace-nowrap">Økonomi</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}