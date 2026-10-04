import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function VakterView({ setAktivSkjerm, token, handterPlussKnapp }: any) {
  const [vakter, setVakter] = useState<any[]>([]);
  const [laster, setLaster] = useState(true);
  const [viserHistorikk, setViserHistorikk] = useState(false);

  useEffect(() => {
    hentVakter();
  }, [viserHistorikk]);

  const hentVakter = async () => {
    setLaster(true);
    try {
      const endpoint = viserHistorikk 
        ? 'https://api.cutcount.no/api/mine-vakter/historikk' 
        : 'https://api.cutcount.no/api/mine-vakter';

      const response = await fetch(endpoint, {
        headers: { 
          'Accept': 'application/json', 
          'Authorization': `Bearer ${token}` 
        }
      });
      const json = await response.json();
      
      if (response.ok && json.data) {
        setVakter(json.data);
      }
    } catch (error) {
      console.log("Feil ved henting:", error);
    } finally {
      setLaster(false);
    }
  };

  const beregnArbeidstimer = (start: string, slutt: string) => {
    if (!start || !slutt) return "0t";
    
    const [startTimer, startMinutter] = start.split(':').map(Number);
    const [sluttTimer, sluttMinutter] = slutt.split(':').map(Number);
    
    let antallMinutter = (sluttTimer * 60 + sluttMinutter) - (startTimer * 60 + startMinutter);
    
    if (antallMinutter < 0) {
      antallMinutter += 24 * 60; 
    }
    
    if (antallMinutter > 330) {
      antallMinutter -= 30;
    }
    
    const ferdigeTimer = (antallMinutter / 60).toFixed(1);
    return ferdigeTimer.replace('.0', '') + 't';
  };

  const formaterVaktData = (vakt: any) => {
    let renDato = vakt.dato || ""; 
    
    let startTid = "00:00";
    if (vakt.start_tid) {
      startTid = vakt.start_tid.length > 5 ? vakt.start_tid.substring(0, 5) : vakt.start_tid;
    }
    
    let sluttTid = "00:00";
    if (vakt.slutt_tid) {
      sluttTid = vakt.slutt_tid.length > 5 ? vakt.slutt_tid.substring(0, 5) : vakt.slutt_tid;
    }

    let penDato = renDato ? renDato : "Dato mangler";
    if (renDato && renDato.includes('-')) {
      const dObj = new Date(renDato);
      if (!isNaN(dObj.getTime())) {
        const dager = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
        const maneder = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
        penDato = `${dager[dObj.getDay()]} ${dObj.getDate()}. ${maneder[dObj.getMonth()]}`;
      }
    }

    const arbeidstimer = beregnArbeidstimer(startTid, sluttTid);

    return { penDato, startTid, sluttTid, arbeidstimer };
  };

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
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Vaktplan</Text>
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
        {/* BRYTER FOR Å VELGE VISNING */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity 
            onPress={() => setViserHistorikk(false)} 
            className={`px-5 py-2.5 rounded-full border ${!viserHistorikk ? 'bg-[#111827] border-[#111827]' : 'bg-transparent border-[#DCDCDA]'}`}
          >
            <Text className={`text-xs font-bold ${!viserHistorikk ? 'text-white' : 'text-gray-500'}`}>Kommende</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setViserHistorikk(true)} 
            className={`px-5 py-2.5 rounded-full border ${viserHistorikk ? 'bg-[#111827] border-[#111827]' : 'bg-transparent border-[#DCDCDA]'}`}
          >
            <Text className={`text-xs font-bold ${viserHistorikk ? 'text-white' : 'text-gray-500'}`}>Historikk</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">
          {viserHistorikk ? 'Tidligere vakter' : 'Dine neste vakter'}
        </Text>
        
        {laster ? (
          <View className="py-10">
            <ActivityIndicator size="large" color="#111827" />
          </View>
        ) : vakter.length === 0 ? (
          <View className="py-10 items-center">
            <Feather name={viserHistorikk ? "archive" : "calendar"} size={40} color="#DCDCDA" />
            <Text className="text-center text-gray-500 font-bold mt-4">
              {viserHistorikk ? 'Ingen historiske vakter funnet.' : 'Ingen kommende vakter funnet.'}
            </Text>
          </View>
        ) : (
          <View className="flex-col">
            {vakter.map((vakt, index) => {
              const { penDato, startTid, sluttTid, arbeidstimer } = formaterVaktData(vakt);

              return (
                <View key={vakt.id || index} className="flex-row justify-between items-center py-4 border-b border-[#DCDCDA]">
                  <View>
                    <Text className="text-sm font-bold text-[#111827] capitalize">{penDato}</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {startTid} - {sluttTid} • {vakt.avdeling?.navn || 'Salong'}
                    </Text>
                  </View>
                  <Text className="text-sm font-black text-[#111827]">
                    {arbeidstimer}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* BUNNMENY MED KUN 3 KNAPPER */}
      <View className="absolute bottom-0 w-full h-[85px] bg-[#F7F7F6]/95 border-t border-[#E5E5E4] flex-row justify-around items-start pt-4 px-8 z-50">
        <TouchableOpacity className="flex-col items-center gap-1 w-16 opacity-40 text-[#111827]" onPress={() => setAktivSkjerm('DASHBOARD')}>
          <Feather name="home" size={24} color="#111827" />
          <Text className="text-[9px] font-bold tracking-widest uppercase mt-1">Hjem</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handterPlussKnapp} 
          className="relative -top-7 w-16 h-16 bg-[#111827] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F7F7F6]"
        >
          <Feather name="plus" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-col items-center gap-1 w-16 opacity-40 text-[#111827]" onPress={() => setAktivSkjerm('MIN_SIDE')}>
          <Feather name="pie-chart" size={24} color="#111827" />
          <Text className="text-[8px] font-bold tracking-widest uppercase mt-1 whitespace-nowrap">Økonomi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}