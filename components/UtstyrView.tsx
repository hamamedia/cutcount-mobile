import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function UtstyrView({ bruker, setAktivSkjerm, handterPlussKnapp }: any) {
  const reeltUtstyr: any[] = bruker?.utstyr || [];
  
  // Henter ut oppgavene som er av typen 'signatur' (sendt fra web-panelet)
  const signaturDokumenter = bruker?.oppgaver?.filter((oppgave: any) => oppgave.type === 'signatur') || [];

  const [valgtUtstyr, setValgtUtstyr] = useState(reeltUtstyr[0]?.navn || '');
  const [visDropdown, setVisDropdown] = useState(false);
  const [tilstand, setTilstand] = useState('TRENGER_SLIPING');
  const [beskrivelse, setBeskrivelse] = useState('');

  const samletVerdi = reeltUtstyr.reduce((sum, item) => sum + (Number(item.verdi) || 0), 0);

  const sendHenvendelse = () => {
    if (!valgtUtstyr) {
      Alert.alert("Ingen utstyr valgt", "Du må velge et registrert utstyr først.");
      return;
    }
    if (!beskrivelse.trim()) {
      Alert.alert("Mangler info", "Skriv en kort beskrivelse av hva som gjelder utstyret.");
      return;
    }
    Alert.alert("Mottatt! ✂️", `Melding om ${valgtUtstyr} er sendt til ledelsen.`);
    setBeskrivelse('');
  };

  // Funksjon for å åpne PDF-dokumentet
  const apneDokument = (sti: string) => {
    if (!sti) {
      Alert.alert("Feil", "Dette dokumentet mangler en gyldig fil.");
      return;
    }
    // Oppdatert med riktig Forge-URL
    const url = `https://api.cutcount.no/storage/${sti}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Feil", "Kunne ikke åpne dokumentet.");
    });
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
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Mitt utstyr</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. SAMLET VERDI PÅ UTLÅN */}
        <View className="w-full bg-[#111827] rounded-[22px] p-5 mb-6 shadow-md flex-col justify-between">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">Samlet verdi på utlån</Text>
            <Text className="text-xl">✂️</Text>
          </View>
          <Text className="text-3xl font-black text-white tracking-tight">
            {samletVerdi > 0 ? `${samletVerdi.toLocaleString('no-NO')} kr` : '0 kr'}
          </Text>
          <Text className="text-[11px] text-gray-400 mt-2">Personlig utstyr registrert utlevert på ditt navn.</Text>
        </View>

        {/* 2. STATUS PÅ UTSTYR */}
        <View className="bg-emerald-50 border border-emerald-200 rounded-[20px] p-4 mb-6 flex-row items-center gap-3">
          <Text className="text-xl">✅</Text>
          <View className="flex-1">
            <Text className="text-xs font-bold text-emerald-900">Alt utstyr registrert OK</Text>
            <Text className="text-[11px] text-emerald-700">Ingen aktive henvendelser om skade eller sliping venter.</Text>
          </View>
        </View>

        {/* ============================================================== */}
        {/* NY SEKSJON: SIGNATURDOKUMENTER FRA WEB                         */}
        {/* ============================================================== */}
        <View className="w-full bg-[#F7F7F6] py-2 mb-2">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Venter på signatur / Godkjenning
          </Text>
        </View>

        <View className="bg-white border border-[#DCDCDA] rounded-[24px] p-5 mb-8 shadow-sm">
          {signaturDokumenter.length > 0 ? (
            signaturDokumenter.map((dok: any, idx: number) => (
              <View key={idx} className="flex-row justify-between items-center p-3 mb-3 border border-blue-100 rounded-xl bg-blue-50 last:mb-0">
                <View className="flex-1 pr-3 flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Feather name="file-text" size={14} color="#1d4ed8" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-blue-900" numberOfLines={1}>{dok.tittel}</Text>
                    <Text className="text-[10px] text-blue-700" numberOfLines={1}>
                      {dok.beskrivelse || 'Dokument som krever din signatur'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => apneDokument(dok.vedlegg_sti)}
                  className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center gap-1 active:bg-blue-700"
                >
                  <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Åpne</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="py-2 items-center">
              <Text className="text-xs font-semibold text-gray-400">Ingen dokumenter</Text>
              <Text className="text-[10px] text-gray-400 mt-0.5">Du har ingen uleste signaturdokumenter.</Text>
            </View>
          )}
        </View>
        {/* ============================================================== */}

        {/* 3. MELD BEHOV */}
        <View className="w-full bg-[#F7F7F6] py-2 mb-2">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Meld behov for sliping / skade
          </Text>
        </View>
        
        <View className="bg-white border border-[#DCDCDA] rounded-[24px] p-5 mb-8 shadow-sm flex-col gap-4">
          <View>
            <Text className="text-xs font-bold text-[#111827] mb-2">Velg registrert utstyr</Text>
            <TouchableOpacity 
              onPress={() => setVisDropdown(!visDropdown)}
              disabled={reeltUtstyr.length === 0}
              className={`w-full border rounded-xl p-3.5 flex-row justify-between items-center ${
                reeltUtstyr.length === 0 ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-200 active:bg-gray-100'
              }`}
            >
              <Text className={`text-xs font-bold ${reeltUtstyr.length === 0 ? 'text-gray-400' : 'text-[#111827]'}`}>
                {valgtUtstyr || (reeltUtstyr.length === 0 ? 'Ingen utstyr registrert på deg' : 'Velg utstyr...')}
              </Text>
              {reeltUtstyr.length > 0 && (
                <Feather name={visDropdown ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
              )}
            </TouchableOpacity>

            {visDropdown && reeltUtstyr.length > 0 && (
              <View className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex-col">
                {reeltUtstyr.map((item: any, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setValgtUtstyr(item.navn);
                      setVisDropdown(false);
                    }}
                    className={`p-3 border-b border-gray-100 flex-row justify-between items-center last:border-b-0 ${
                      valgtUtstyr === item.navn ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <Text className="text-xs font-semibold text-[#111827]">{item.navn}</Text>
                    {valgtUtstyr === item.navn && <Feather name="check" size={14} color="#111827" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View>
            <Text className="text-xs font-bold text-[#111827] mb-2">Hva gjelder det?</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={() => setTilstand('TRENGER_SLIPING')}
                className={`flex-1 p-3 rounded-xl border items-center ${tilstand === 'TRENGER_SLIPING' ? 'bg-[#111827] border-[#111827]' : 'bg-white border-gray-200'}`}
              >
                <Text className={`text-xs font-bold ${tilstand === 'TRENGER_SLIPING' ? 'text-white' : 'text-[#111827]'}`}>Sliping</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setTilstand('SKADET')}
                className={`flex-1 p-3 rounded-xl border items-center ${tilstand === 'SKADET' ? 'bg-[#111827] border-[#111827]' : 'bg-white border-gray-200'}`}
              >
                <Text className={`text-xs font-bold ${tilstand === 'SKADET' ? 'text-white' : 'text-[#111827]'}`}>Skadet / Defekt</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-xs font-bold text-[#111827] mb-2">Beskrivelse</Text>
            <TextInput 
              value={beskrivelse}
              onChangeText={setBeskrivelse}
              placeholder="F.eks. Slitt blad, hak etter fall osv..."
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium text-[#111827] h-20"
            />
          </View>

          <TouchableOpacity 
            onPress={sendHenvendelse}
            className="w-full bg-[#111827] p-3.5 rounded-xl flex-row justify-center items-center gap-2 active:opacity-90"
          >
            <Feather name="send" size={14} color="white" />
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Send melding til ledelsen</Text>
          </TouchableOpacity>
        </View>

        {/* 4. UTLEVERT UTSTYR */}
        <View className="w-full bg-[#F7F7F6] py-2 mb-2">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Tidligere utlevert utstyr
          </Text>
        </View>
        
        <View className="bg-white border border-[#DCDCDA] rounded-[20px] p-4 mb-6 shadow-sm flex-col gap-3">
          {reeltUtstyr.length > 0 ? (
            reeltUtstyr.map((item: any, idx: number) => (
              <View key={idx} className="flex-row justify-between items-center pb-2.5 border-b border-gray-100 last:border-b-0 last:pb-0">
                <View>
                  <Text className="text-xs font-bold text-[#111827]">{item.navn}</Text>
                  <Text className="text-[10px] text-gray-500">
                    Mottatt: {item.dato || 'N/A'} • Verdi: {item.verdi ? `${item.verdi} kr` : 'Ej angitt'}
                  </Text>
                </View>
                <Text className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {item.status || 'Aktiv'}
                </Text>
              </View>
            ))
          ) : (
            <View className="py-4 items-center">
              <Text className="text-xs font-semibold text-gray-400">Ingen utstyrsregistreringer funnet</Text>
              <Text className="text-[10px] text-gray-400 mt-0.5">Utstyr tildelt fra web-panel vil vises her.</Text>
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