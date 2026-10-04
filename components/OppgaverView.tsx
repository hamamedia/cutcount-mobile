import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function OppgaverView({ setAktivSkjerm, handterPlussKnapp, token, setValgtOppgave }: any) {
  const [oppgaver, setOppgaver] = useState<any[]>([]);
  const [laster, setLaster] = useState(true);
  
  const [aktivFane, setAktivFane] = useState<'aktive' | 'historikk'>('aktive');

  useEffect(() => {
    hentOppgaver();
  }, []);

  const hentOppgaver = async () => {
    try {
      setLaster(true);
      const response = await fetch('https://api.cutcount.no/api/mine-oppgaver', {
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await response.json();

      if (response.ok) {
        setOppgaver(data.data);
      } else {
        Alert.alert('Feil', 'Kunne ikke hente oppgaver.');
      }
    } catch (error) {
      Alert.alert('Nettverksfeil', 'Får ikke kontakt med serveren.');
    } finally {
      setLaster(false);
    }
  };

  const markerSomFullfort = async (id: number) => {
    try {
      const naa = new Date().toISOString();
      setOppgaver(oppgaver.map(oppgave => 
        oppgave.id === id ? { ...oppgave, fullfort: true, updated_at: naa } : oppgave
      ));

      const response = await fetch(`https://api.cutcount.no/api/oppgaver/${id}/fullfor`, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        Alert.alert('Feil', 'Kunne ikke lagre at oppgaven var fullført.');
        hentOppgaver(); 
      }
    } catch (error) {
      Alert.alert('Nettverksfeil', 'Får ikke kontakt med serveren.');
      hentOppgaver();
    }
  };

  const apneVedlegg = async (sti: string) => {
    const url = `https://api.cutcount.no/storage/${sti}`;
    try {
      const kanApnes = await Linking.canOpenURL(url);
      if (kanApnes) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Feil', 'Telefonen din støtter ikke åpning av denne filtypen.');
      }
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke åpne vedlegget.');
    }
  };

  const formaterDato = (datoTekst: string) => {
    if (!datoTekst) return 'Ukjent dato';
    const d = new Date(datoTekst.replace(' ', 'T'));
    if (isNaN(d.getTime())) return datoTekst;
    
    const dag = d.getDate().toString().padStart(2, '0');
    const maneder = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    const mnd = maneder[d.getMonth()];
    const ar = d.getFullYear();
    const timer = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    
    return `${dag}. ${mnd} ${ar} kl ${timer}:${min}`;
  };

  const sjekkOmUtlopt = (fristDato: string | null) => {
    if (!fristDato) return false;
    const frist = new Date(fristDato.replace(' ', 'T'));
    const naa = new Date();
    return frist < naa;
  };

  const aktiveOppgaver = oppgaver.filter(o => !o.fullfort);
  const historikkOppgaver = oppgaver.filter(o => o.fullfort);
  const listeSomSkalVises = aktivFane === 'aktive' ? aktiveOppgaver : historikkOppgaver;

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
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Oppgaver</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setAktivSkjerm('PROFIL')}
          className="w-10 h-10 rounded-full bg-[#E5E5E4] border-2 border-[#111827] shadow-sm overflow-hidden"
        >
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} className="w-full h-full" />
        </TouchableOpacity>
      </View>

      {/* FANER: AKTIVE / HISTORIKK */}
      <View className="px-6 mt-6 mb-4">
        <View className="flex-row gap-6 border-b border-[#E5E5E4]">
          <TouchableOpacity 
            onPress={() => setAktivFane('aktive')}
            className={`pb-3 ${aktivFane === 'aktive' ? 'border-b-2 border-[#111827]' : ''}`}
          >
            <Text className={`font-bold ${aktivFane === 'aktive' ? 'text-[#111827]' : 'text-gray-400'}`}>
              Aktive ({aktiveOppgaver.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setAktivFane('historikk')}
            className={`pb-3 ${aktivFane === 'historikk' ? 'border-b-2 border-[#111827]' : ''}`}
          >
            <Text className={`font-bold ${aktivFane === 'historikk' ? 'text-[#111827]' : 'text-gray-400'}`}>
              Historikk
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LISTE OVER OPPGAVER */}
      <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 120 }}>
        {laster ? (
          <ActivityIndicator size="large" color="#111827" className="mt-10" />
        ) : listeSomSkalVises.length === 0 ? (
          <View className="flex items-center justify-center mt-10 opacity-50">
            <Feather name={aktivFane === 'aktive' ? "check-circle" : "inbox"} size={48} color="#111827" />
            <Text className="text-lg font-bold text-[#111827] mt-4">
              {aktivFane === 'aktive' ? 'Alt er gjort!' : 'Ingen historikk'}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {aktivFane === 'aktive' ? 'Du har ingen aktive oppgaver.' : 'Du har ikke fullført noen oppgaver enda.'}
            </Text>
          </View>
        ) : (
          listeSomSkalVises.map((oppgave) => {
            const erFullfort = oppgave.fullfort;
            const erUtlopt = !erFullfort && sjekkOmUtlopt(oppgave.frist_dato);
            
            // 1. SIGNATUR-BOKS
            if (oppgave.type === 'signatur') {
              return (
                <TouchableOpacity 
                  key={oppgave.id}
                  disabled={erFullfort}
                  onPress={() => {
                    setValgtOppgave(oppgave);
                    setAktivSkjerm('UTSTYR');
                  }}
                  className={`border-2 rounded-[24px] p-5 mb-6 shadow-sm relative flex-row items-start gap-4 ${
                    erFullfort ? 'bg-white border-green-500 opacity-80' : (erUtlopt ? 'bg-red-50 border-red-500' : 'bg-white border-red-500')
                  }`}
                >
                  <View className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${erFullfort ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Feather name={erFullfort ? "check" : "edit-3"} size={20} color={erFullfort ? "#22c55e" : "#ef4444"} />
                  </View>
                  
                  <View className="flex-1 flex-col">
                    <View className="flex-row items-center gap-2 flex-wrap">
                      <Text className={`text-sm font-bold ${erFullfort ? 'text-gray-400 line-through' : 'text-[#111827]'}`}>
                        {oppgave.tittel}
                      </Text>
                      {erUtlopt && (
                        <View className="bg-red-500 px-2 py-0.5 rounded">
                          <Text className="text-[9px] font-bold text-white uppercase">Frist utløpt</Text>
                        </View>
                      )}
                    </View>
                    
                    {oppgave.beskrivelse ? (
                      <Text className={`text-xs mt-1 ${erFullfort ? 'text-gray-400' : 'font-medium text-gray-500'}`}>
                        {erFullfort ? 'Signert og bekreftet' : oppgave.beskrivelse}
                      </Text>
                    ) : null}
                    
                    {oppgave.vedlegg_sti && (
                      <View className="mt-4 flex-row items-start">
                        <TouchableOpacity 
                          onPress={() => apneVedlegg(oppgave.vedlegg_sti)}
                          className="flex-row items-center gap-2 bg-[#F7F7F6] px-4 py-2.5 rounded-xl border border-[#DCDCDA]"
                        >
                          <Feather name="paperclip" size={14} color="#111827" />
                          <Text className="text-xs font-bold text-[#111827]">
                            {oppgave.vedlegg_navn || 'Åpne dokument'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {erFullfort && (
                      <View className="mt-4 pt-3 border-t border-gray-100 flex-col gap-1">
                        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          Mottatt: {formaterDato(oppgave.created_at)}
                        </Text>
                        <Text className="text-[10px] text-green-600 font-bold uppercase tracking-widest">
                          Signert: {formaterDato(oppgave.updated_at)}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {!erFullfort && (
                    <View className="mt-2 shrink-0">
                      <Feather name="chevron-right" size={20} color="#ef4444" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }

            // 2. BESKJED-BOKS
            if (oppgave.type === 'beskjed') {
              return (
                <View key={oppgave.id} className={`border rounded-[24px] p-5 mb-6 relative flex-col ${
                  erFullfort ? 'bg-[#E5E5E4]/50 border-[#DCDCDA] opacity-60' : (erUtlopt ? 'bg-red-50 border-red-400' : 'bg-[#E5E5E4]/50 border-[#DCDCDA]')
                }`}>
                  {!erFullfort && (
                    <View className="absolute top-6 right-6 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  )}
                  {erFullfort && (
                    <View className="absolute top-6 right-6">
                      <Feather name="check" size={16} color="#9ca3af" />
                    </View>
                  )}
                  
                  <View className="flex-row items-center gap-2 mb-2 flex-wrap">
                    <Text className={`text-[10px] font-bold tracking-widest uppercase ${erFullfort ? 'text-gray-400' : 'text-gray-500'}`}>
                      {oppgave.tittel}
                    </Text>
                    {erUtlopt && (
                      <View className="bg-red-500 px-2 py-0.5 rounded">
                        <Text className="text-[9px] font-bold text-white uppercase">Frist utløpt</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text className={`text-sm font-semibold leading-snug ${erFullfort ? 'text-gray-400' : 'text-[#111827]'}`}>
                    "{oppgave.beskrivelse}"
                  </Text>

                  {oppgave.vedlegg_sti && (
                    <View className="mt-4 flex-row items-start">
                      <TouchableOpacity 
                        onPress={() => apneVedlegg(oppgave.vedlegg_sti)}
                        className="flex-row items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-[#DCDCDA] shadow-sm"
                      >
                        <Feather name="paperclip" size={14} color="#5B7B88" />
                        <Text className="text-xs font-bold text-[#5B7B88]">
                          {oppgave.vedlegg_navn || 'Se vedlegg'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {!erFullfort ? (
                    <View className={`mt-5 pt-4 border-t ${erUtlopt ? 'border-red-200' : 'border-[#DCDCDA]/50'}`}>
                      <TouchableOpacity 
                        onPress={() => markerSomFullfort(oppgave.id)} 
                        className={`w-full py-3.5 rounded-[14px] flex-row items-center justify-center gap-2 shadow-sm ${erUtlopt ? 'bg-red-600' : 'bg-[#111827]'}`}
                      >
                        <Feather name="check-circle" size={16} color="white" />
                        <Text className="text-xs font-bold text-white uppercase tracking-widest">Lest og forstått</Text>
                      </TouchableOpacity>
                      <Text className={`text-xs text-center mt-3 ${erUtlopt ? 'text-red-500' : 'text-gray-500'}`}>
                        — Fra ledelsen • {formaterDato(oppgave.created_at)}
                      </Text>
                    </View>
                  ) : (
                    <View className="mt-4 pt-3 border-t border-[#DCDCDA]/50 flex-col gap-1">
                      <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Mottatt: {formaterDato(oppgave.created_at)}
                      </Text>
                      <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Lest og forstått: {formaterDato(oppgave.updated_at)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }

            // 3. VANLIG OPPGAVE-BOKS
            return (
              <View key={oppgave.id} className={`flex-row items-start gap-4 p-5 border rounded-[24px] mb-4 shadow-sm ${
                erFullfort ? 'bg-white border-[#DCDCDA] opacity-60' : (erUtlopt ? 'bg-red-50 border-red-400' : 'bg-white border-[#DCDCDA]')
              }`}>
                <TouchableOpacity 
                  onPress={() => !erFullfort && markerSomFullfort(oppgave.id)}
                  disabled={erFullfort}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    erFullfort ? 'bg-[#111827] border-[#111827]' : (erUtlopt ? 'border-red-500 bg-white' : 'border-[#111827]')
                  }`}
                >
                  {erFullfort && <Feather name="check" size={14} color="white" />}
                </TouchableOpacity>

                <View className="flex-1 flex-col">
                  <Text className={`text-sm font-bold ${erFullfort ? 'text-gray-400 line-through' : 'text-[#111827]'}`}>
                    {oppgave.tittel}
                  </Text>
                  {oppgave.beskrivelse ? (
                    <Text className={`text-xs mt-1 ${erFullfort ? 'text-gray-400' : 'text-gray-500'}`}>
                      {oppgave.beskrivelse}
                    </Text>
                  ) : null}

                  {oppgave.vedlegg_sti && (
                    <View className="mt-3 flex-row items-start">
                      <TouchableOpacity 
                        onPress={() => apneVedlegg(oppgave.vedlegg_sti)}
                        className="flex-row items-center gap-2 bg-[#F7F7F6] px-3 py-2 rounded-lg border border-[#DCDCDA]"
                      >
                        <Feather name="paperclip" size={12} color="#111827" />
                        <Text className="text-[11px] font-bold text-[#111827]">
                          {oppgave.vedlegg_navn || 'Åpne fil'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {erFullfort && (
                    <View className="mt-3 pt-3 border-t border-gray-100 flex-col gap-1">
                      <Text className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Sendt: {formaterDato(oppgave.created_at)}
                      </Text>
                      <Text className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Utført: {formaterDato(oppgave.updated_at)}
                      </Text>
                    </View>
                  )}
                </View>

                {oppgave.frist_dato && !erFullfort && (
                   <View className={`px-2 py-1 rounded-md shrink-0 ${erUtlopt ? 'bg-red-500' : 'bg-red-100'}`}>
                     <Text className={`text-[10px] font-bold uppercase ${erUtlopt ? 'text-white' : 'text-red-600'}`}>
                        {erUtlopt ? 'Frist utløpt' : 'Frist'}
                     </Text>
                   </View>
                )}
              </View>
            );
          })
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