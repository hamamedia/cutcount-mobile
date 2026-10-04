import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function TipsView({ setAktivSkjerm }: any) {
  // Tilstander for kasse-matematikken
  const basePris = 900;
  const [tips, setTips] = useState<string>('0');
  
  const tipsTall = parseInt(tips || '0', 10);
  const totalSum = basePris + tipsTall;

  // Funksjoner for Numpad
  const trykkTall = (tall: string) => {
    if (tips === '0') setTips(tall);
    else if (tips.length < 5) setTips(tips + tall); // Begrenser til maks 99 999 i tips
  };

  const trykkSlett = () => {
    if (tips.length > 1) setTips(tips.slice(0, -1));
    else setTips('0');
  };

  const trykkFjernAlt = () => setTips('0');

  const fullforBetaling = () => {
    Alert.alert("Betaling godkjent! 🎉", `Totalt ${totalSum},- er registrert. Bra jobba!`);
    setAktivSkjerm('DASHBOARD'); // Sender deg tilbake til start etter salget
  };

  return (
    <View className="flex-1 bg-[#F7F7F6]">
      
      {/* HEADER */}
      <View className="pt-16 px-6 pb-4 flex-row items-center justify-between relative z-10">
        <TouchableOpacity 
          onPress={() => setAktivSkjerm('BETALING')}
          className="w-12 h-12 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm"
        >
          <Feather name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-[#111827] tracking-tight">Legg til tips</Text>
        <View className="w-12 h-12" />
      </View>

      {/* INNHOLD */}
      <View className="flex-1 px-6 pt-2 pb-6 flex-col">
        
        {/* OPPSUMMERING BOKS */}
        <View className="bg-white border-2 border-[#111827] rounded-[32px] p-6 mb-8 shadow-sm">
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-gray-500">Tjenester & Produkter</Text>
            <Text className="text-sm font-black text-[#111827]">{basePris},-</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-bold text-gray-500">Tips (Din inntjening)</Text>
            {tipsTall > 0 ? (
              <Text className="text-sm font-black text-[#4ADE80] bg-green-50 px-2 py-1 rounded-lg">
                + {tipsTall},-
              </Text>
            ) : (
              <Text className="text-sm font-bold text-gray-400">0,-</Text>
            )}
          </View>

          <View className="w-full h-[1px] bg-[#E5E5E4] my-4" />

          <View className="flex-row justify-between items-end">
            <Text className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Total sum å betale</Text>
            <View className="flex-row items-baseline">
              <Text className="text-4xl font-black text-[#111827] tracking-tight">{totalSum}</Text>
              <Text className="text-xl text-gray-400 ml-0.5">,-</Text>
            </View>
          </View>
        </View>

        {/* HURTIGVALG (Quick tips) */}
        <View className="flex-row gap-2 mb-6">
          <TouchableOpacity onPress={() => setTips('0')} className="flex-1 py-3 bg-white border border-[#DCDCDA] rounded-xl shadow-sm items-center">
            <Text className="text-xs font-bold text-[#111827]">Ingen tips</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTips('50')} className="flex-1 py-3 bg-white border border-[#DCDCDA] rounded-xl shadow-sm items-center">
            <Text className="text-xs font-bold text-[#111827]">+ 50,-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTips('100')} className="flex-1 py-3 bg-white border border-[#DCDCDA] rounded-xl shadow-sm items-center">
            <Text className="text-xs font-bold text-[#111827]">+ 100,-</Text>
          </TouchableOpacity>
        </View>

        {/* NUMPAD TASTATUR */}
        <View className="flex-1 flex-col gap-3 justify-end pb-4">
          <View className="flex-row gap-3 h-[60px]">
            {['1', '2', '3'].map((num) => (
              <TouchableOpacity key={num} onPress={() => trykkTall(num)} className="flex-1 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm items-center justify-center">
                <Text className="text-2xl font-black text-[#111827]">{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row gap-3 h-[60px]">
            {['4', '5', '6'].map((num) => (
              <TouchableOpacity key={num} onPress={() => trykkTall(num)} className="flex-1 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm items-center justify-center">
                <Text className="text-2xl font-black text-[#111827]">{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row gap-3 h-[60px]">
            {['7', '8', '9'].map((num) => (
              <TouchableOpacity key={num} onPress={() => trykkTall(num)} className="flex-1 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm items-center justify-center">
                <Text className="text-2xl font-black text-[#111827]">{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row gap-3 h-[60px]">
            <TouchableOpacity onPress={trykkFjernAlt} className="flex-1 bg-[#F7F7F6] border border-[#DCDCDA] rounded-[20px] items-center justify-center">
              <Text className="text-lg font-bold text-gray-500">C</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => trykkTall('0')} className="flex-1 bg-white border border-[#DCDCDA] rounded-[20px] shadow-sm items-center justify-center">
              <Text className="text-2xl font-black text-[#111827]">0</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={trykkSlett} className="flex-1 bg-[#F7F7F6] border border-[#DCDCDA] rounded-[20px] items-center justify-center">
              <Feather name="delete" size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* FAST BUNN-KNAPP FOR FULLFØRING */}
      <View className="p-6 pt-4 bg-[#F7F7F6]">
        <TouchableOpacity 
          onPress={fullforBetaling}
          className="w-full bg-[#111827] rounded-[20px] py-5 flex-row items-center justify-center gap-3 shadow-lg"
        >
          <Feather name="check" size={20} color="white" />
          <Text className="text-white font-bold text-base tracking-widest uppercase">Fullfør betaling</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}