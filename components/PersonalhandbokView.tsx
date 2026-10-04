import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PersonalhandbokView({ setAktivSkjerm, handterPlussKnapp }: any) {
  const [sok, setSok] = useState('');
  const [valgtKategori, setValgtKategori] = useState('ALLE');
  const [apnetKapittel, setApnetKapittel] = useState<number | null>(0); // Første er åpent som standard

  // Dummy-data for personalhåndboken
  const artikler = [
    {
      id: 1,
      kategori: 'ARBEIDSTID',
      tittel: 'Arbeidstid og stempling',
      ikon: '⏰',
      innhold: 'Alle ansatte skal stemple inn ved vaktstart og ut ved vaktslutt via kassen i mobilappen. Pause på 30 minutter avvikles etter avtale med daglig leder.'
    },
    {
      id: 2,
      kategori: 'FRAVÆR',
      tittel: 'Egenmelding og sykdom',
      ikon: '🏥',
      innhold: 'Ved sykdom må beskjed gis til daglig leder senest 1 time før vaktstart via telefon/app. Egenmelding kan benyttes i inntil 3 kalenderdager sammenhengende.'
    },
    {
      id: 3,
      kategori: 'BEKLEDNING',
      tittel: 'Dresscode og hygiene',
      ikon: '✂️',
      innhold: 'Vi representerer salongen utad. Pent og rent sort/mørkt arbeidstøy kreves. Alt utstyr skal desinfiseres og rengjøres etter hver kunde.'
    },
    {
      id: 4,
      kategori: 'LØNN',
      tittel: 'Lønnsutbetaling og provisjon',
      ikon: '💸',
      innhold: 'Lønn utbetales den 20. i hver måned. Provisjonsgrunnlag beregnes automatisk fra kassesystemet og gjøres tilgjengelig under Økonomi-fana.'
    },
    {
      id: 5,
      kategori: 'HMS',
      tittel: 'Helse, miljø og sikkerhet (HMS)',
      ikon: '🛡️',
      innhold: 'Salongen benytter godkjente avsug og hansker ved kjemiske behandlinger. Førstehjelpsutstyr finnes på bakrommet ved personalrommet.'
    }
  ];

  const filtrerteArtikler = artikler.filter(item => {
    const matcherSok = item.tittel.toLowerCase().includes(sok.toLowerCase()) || item.innhold.toLowerCase().includes(sok.toLowerCase());
    const matcherKategori = valgtKategori === 'ALLE' || item.kategori === valgtKategori;
    return matcherSok && matcherKategori;
  });

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
          <Text className="text-2xl font-black text-[#111827] tracking-tight">Personalhåndbok</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* TOPPBOKS */}
        <View className="w-full bg-[#111827] rounded-[20px] p-4 mb-6 shadow-sm flex-col justify-between">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">Salongens retningslinjer</Text>
            <Text className="text-xl">📘</Text>
          </View>
          <Text className="text-2xl font-black text-white tracking-tight">Personalhåndbok</Text>
          <Text className="text-[11px] text-gray-400 mt-1">Søk og finn svar på regler, rutiner og rettigheter.</Text>
        </View>

        {/* SØKEFELT */}
        <View className="relative flex-row items-center w-full mb-4">
          <View className="absolute left-4 z-10 flex items-center justify-center pointer-events-none">
            <Feather name="search" size={18} color="#9ca3af" />
          </View>
          <TextInput 
            value={sok}
            onChangeText={setSok}
            placeholder="Søk i personalhåndboken..." 
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-white border border-[#DCDCDA] text-[#111827] text-xs font-semibold rounded-[16px] pl-11 pr-4 py-3 shadow-sm"
          />
        </View>

        {/* KATEGORIER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 mb-6">
          {['ALLE', 'ARBEIDSTID', 'FRAVÆR', 'BEKLEDNING', 'LØNN', 'HMS'].map((kat, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => setValgtKategori(kat)}
              className={`px-3.5 py-2 rounded-full border ${valgtKategori === kat ? 'bg-[#111827] border-[#111827]' : 'bg-white border-[#DCDCDA]'}`}
            >
              <Text className={`text-[10px] font-bold ${valgtKategori === kat ? 'text-white' : 'text-[#111827]'}`}>{kat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ARTIKLER / RETNINGSLINJER */}
        <View className="w-full bg-[#F7F7F6] py-1 mb-2">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Retningslinjer & Rutiner
          </Text>
        </View>

        <View className="flex-col gap-3 mb-6">
          {filtrerteArtikler.length > 0 ? (
            filtrerteArtikler.map((artikkel) => {
              const erApen = apnetKapittel === artikkel.id;
              return (
                <View key={artikkel.id} className="w-full bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm overflow-hidden">
                  <TouchableOpacity 
                    onPress={() => setApnetKapittel(erApen ? null : artikkel.id)}
                    className="p-4 flex-row items-center justify-between active:bg-gray-50"
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-xl">{artikkel.ikon}</Text>
                      <View>
                        <Text className="text-xs font-bold text-[#111827]">{artikkel.tittel}</Text>
                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{artikkel.kategori}</Text>
                      </View>
                    </View>
                    <Feather name={erApen ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
                  </TouchableOpacity>

                  {erApen && (
                    <View className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50/50">
                      <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                        {artikkel.innhold}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View className="bg-white border border-[#DCDCDA] rounded-[20px] p-6 items-center">
              <Text className="text-xs font-semibold text-gray-400">Ingen emner matchet søket ditt</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* BUNNMENY */}
      <View className="absolute bottom-0 w-full h-[90px] bg-white border-t border-[#DCDCDA] flex-row justify-around items-start pt-3 px-6 z-50 shadow-lg">
        <TouchableOpacity className="flex-col items-center justify-center gap-1 w-20 active:opacity-70" onPress={() => setAktivSkjerm('DASHBOARD')}>
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

        <TouchableOpacity className="flex-col items-center justify-center gap-1 w-20 active:opacity-70" onPress={() => setAktivSkjerm('MIN_SIDE')}>
          <Feather name="pie-chart" size={26} color="#111827" />
          <Text className="text-[11px] font-black tracking-wider uppercase text-[#111827] mt-0.5 whitespace-nowrap">Økonomi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}