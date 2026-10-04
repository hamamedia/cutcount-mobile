import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MenyView({ bruker, aktivAvdeling, setAktivSkjerm, tjenester, produkter, handlekurv, setHandlekurv, leggTilIKurv, handterPlussKnapp }: any) {
  const [fane, setFane] = useState<'tjenester' | 'produkter'>('tjenester');
  
  // 🎯 Tilstand for redigering av pris
  const [redigerIndex, setRedigerIndex] = useState<number | null>(null);
  const [nyPrisTekst, setNyPrisTekst] = useState('');

  const totalAntall = handlekurv ? handlekurv.length : 0;
  const totalPris = handlekurv ? handlekurv.reduce((sum: number, item: any) => sum + item.pris, 0) : 0;

  const getIkon = (navn: string) => {
    if (!navn) return '✨';
    const n = navn.toLowerCase();
    
    if (n.includes('skjegg') || n.includes('maskin')) return '🧔';
    if (n.includes('fade')) return '💈';
    if (n.includes('vask')) return '🫧';
    if (n.includes('gutt') || n.includes('barn')) return '👦';
    
    if (n.includes('sjampo') || n.includes('shampoo') || n.includes('balsam')) return '🧴';
    if (n.includes('voks') || n.includes('wax') || n.includes('renati') || n.includes('mate')) return '📦';
    if (n.includes('spray') || n.includes('powder') || n.includes('pulver')) return '💨';
    if (n.includes('olje') || n.includes('oil')) return '💧';
    
    return '✂️';
  };

  const slettFraKurv = (indeksSomSkalSlettes: number) => {
    if (!setHandlekurv) return;
    const nyKurv = [...handlekurv];
    nyKurv.splice(indeksSomSkalSlettes, 1); 
    setHandlekurv(nyKurv);
  };

  // Åpner modalen for å redigere prisen
  const startRedigering = (index: number, pris: number) => {
    setRedigerIndex(index);
    setNyPrisTekst(pris.toString());
  };

  // Lagrer den nye prisen i handlekurven
  const lagreNyPris = () => {
    if (redigerIndex === null || !setHandlekurv) return;
    
    const oppdatertKurv = [...handlekurv];
    const redigertPris = parseFloat(nyPrisTekst) || 0;
    
    oppdatertKurv[redigerIndex].pris = redigertPris;
    setHandlekurv(oppdatertKurv);
    setRedigerIndex(null);
  };

  return (
    <View className="flex-1 bg-[#F7F7F6]">
      
      {/* 🎯 MODAL FOR PRISENDRING */}
      <Modal visible={redigerIndex !== null} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[32px] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-xl font-black text-[#111827]">Endre pris</Text>
                <Text className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                  {redigerIndex !== null ? handlekurv[redigerIndex]?.navn : ''}
                </Text>
              </View>
              <View className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Feather name="edit-3" size={20} color="#ca8a04" />
              </View>
            </View>

            <TextInput
              keyboardType="numeric"
              value={nyPrisTekst}
              onChangeText={setNyPrisTekst}
              className="bg-[#F7F7F6] text-4xl font-black text-center py-6 rounded-[24px] border border-[#E5E5E4] text-[#111827] mb-8"
              autoFocus
            />

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setRedigerIndex(null)} 
                className="flex-1 py-4 bg-gray-100 rounded-[20px] items-center"
              >
                <Text className="font-bold text-gray-500 uppercase tracking-widest text-xs">Avbryt</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={lagreNyPris} 
                className="flex-1 py-4 bg-[#111827] rounded-[20px] items-center"
              >
                <Text className="font-bold text-white uppercase tracking-widest text-xs">Lagre pris</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* HEADER */}
      <View className="pt-14 px-6 pb-4 bg-[#F7F7F6] z-10">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-black text-[#111827] tracking-tight">Kasse</Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <Text className="text-[10px] font-bold text-green-600 uppercase">
                Innsjekket ({aktivAvdeling?.navn || 'Salong'})
              </Text>
            </View>
          </View>
        </View>

        <View className="relative flex-row items-center w-full">
          <View className="absolute left-4 z-10 flex items-center justify-center pointer-events-none">
            <Feather name="search" size={20} color="#9ca3af" />
          </View>
          <TextInput 
            placeholder="Søk tjeneste eller produkt..." 
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-white border border-[#DCDCDA] text-[#111827] text-sm font-semibold rounded-[20px] pl-11 pr-14 py-4 shadow-sm"
          />
          <TouchableOpacity className="absolute right-1.5 w-11 h-11 bg-[#111827] rounded-[16px] flex items-center justify-center shadow-sm">
            <Feather name="maximize" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* KATEGORIER */}
      <View className="flex-row gap-2 px-6 pb-2 border-b border-[#E5E5E4] z-10 bg-[#F7F7F6]">
        <TouchableOpacity 
          onPress={() => setFane('tjenester')}
          className={`flex-1 py-2 rounded-full items-center justify-center ${fane === 'tjenester' ? 'bg-[#111827] shadow-md' : 'bg-white border border-[#DCDCDA]'}`}
        >
          <Text className={`text-xs font-bold tracking-wider uppercase ${fane === 'tjenester' ? 'text-white' : 'text-[#111827]'}`}>Tjenester</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setFane('produkter')}
          className={`flex-1 py-2 rounded-full items-center justify-center ${fane === 'produkter' ? 'bg-[#111827] shadow-md' : 'bg-white border border-[#DCDCDA]'}`}
        >
          <Text className={`text-xs font-bold tracking-wider uppercase ${fane === 'produkter' ? 'text-white' : 'text-[#111827]'}`}>Produkter</Text>
        </TouchableOpacity>
      </View>

      {/* INNHOLD */}
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 320 }} showsVerticalScrollIndicator={false}>
        
        {fane === 'tjenester' && (
          <View className="flex-col gap-3">
            {tjenester && tjenester.length > 0 ? (
              tjenester.map((tjeneste: any, index: number) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => leggTilIKurv(tjeneste.navn, tjeneste.pris, 'tjeneste')}
                  className="flex-row items-center justify-between p-3 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm active:bg-gray-50"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Text className="text-lg">{getIkon(tjeneste.navn)}</Text>
                    </View>
                    <Text className="text-sm font-bold text-[#111827]">{tjeneste.navn}</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Text className="text-sm font-black text-[#111827]">{tjeneste.pris || 0},-</Text>
                    <View className="w-8 h-8 bg-[#F7F7F6] border border-[#DCDCDA] rounded-full flex items-center justify-center">
                      <Feather name="plus" size={16} color="#111827" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-center text-gray-500 mt-10 font-bold">Laster tjenester eller ingen funnet...</Text>
            )}
          </View>
        )}

        {fane === 'produkter' && (
          <View className="flex-col gap-3">
            {produkter && produkter.length > 0 ? (
              produkter.map((produkt: any, index: number) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => leggTilIKurv(produkt.navn, produkt.utsalgspris, 'produkt')}
                  className="flex-row items-center justify-between p-3 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm active:bg-gray-50"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Text className="text-lg">{getIkon(produkt.navn)}</Text>
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-[#111827]">{produkt.navn}</Text>
                      {produkt.beskrivelse && (
                        <Text className="text-[11px] text-gray-500">{produkt.beskrivelse}</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Text className="text-sm font-black text-[#111827]">{produkt.utsalgspris || 0},-</Text>
                    <View className="w-8 h-8 bg-[#F7F7F6] border border-[#DCDCDA] rounded-full flex items-center justify-center">
                      <Feather name="plus" size={16} color="#111827" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-center text-gray-500 mt-10 font-bold">Ingen produkter funnet i hylla...</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* HANDLEKURV PANEL MED BLYANT OG SØPPELBØTTE */}
      {totalAntall > 0 && (
        <View className="absolute bottom-[95px] left-4 right-4 z-40 bg-[#111827] rounded-[32px] p-2 shadow-2xl">
          
          <View className="max-h-[160px] px-3 pt-3 pb-2">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">I handlevognen:</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {handlekurv.map((vare: any, index: number) => (
                <View key={index} className="flex-row items-center justify-between py-2.5 border-b border-white/10 last:border-0">
                  
                  <View className="flex-row items-center gap-2 flex-1 pr-2">
                    <Text className="text-white text-sm font-bold" numberOfLines={1}>{vare.navn}</Text>
                  </View>
                  
                  <View className="flex-row items-center gap-3">
                    {/* 🎯 Hvis prisen er endret, viser vi den gamle med strek over, og den nye i gult! */}
                    {vare.pris !== vare.originalPris && vare.originalPris !== undefined ? (
                      <View className="items-end mr-1">
                        <Text className="text-gray-500 text-[10px] font-bold line-through">{vare.originalPris},-</Text>
                        <Text className="text-yellow-400 text-sm font-black">{vare.pris},-</Text>
                      </View>
                    ) : (
                      <Text className="text-gray-300 text-sm font-black mr-1">{vare.pris},-</Text>
                    )}

                    {/* Endre-knapp */}
                    <TouchableOpacity 
                      onPress={() => startRedigering(index, vare.pris)}
                      className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center active:bg-blue-500/40"
                    >
                      <Feather name="edit-2" size={14} color="#60a5fa" />
                    </TouchableOpacity>

                    {/* Slette-knapp */}
                    <TouchableOpacity 
                      onPress={() => slettFraKurv(index)}
                      className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center active:bg-red-500/40"
                    >
                      <Feather name="trash-2" size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                </View>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity 
            onPress={() => setAktivSkjerm?.('BETALING')} 
            className="w-full bg-[#22c55e] rounded-[24px] p-4 flex-row items-center justify-between shadow-sm mt-1"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                <Text className="font-bold text-white">{totalAntall}</Text>
              </View>
              <View>
                <Text className="text-[10px] font-bold tracking-widest text-green-100 uppercase">Gå til betaling</Text>
                <Text className="text-xl font-black text-white">{totalPris},-</Text>
              </View>
            </View>
            <Feather name="arrow-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

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

        <TouchableOpacity className="flex-col items-center gap-1 w-16 opacity-40 text-[#111827]" onPress={() => setAktivSkjerm?.('MIN_SIDE')}>
          <Feather name="pie-chart" size={24} color="#111827" />
          <Text className="text-[8px] font-bold tracking-widest uppercase mt-1 whitespace-nowrap">Økonomi</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}