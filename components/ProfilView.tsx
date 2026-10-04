import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfilView({ bruker, setAktivSkjerm }: any) {
  const [viserSupport, setViserSupport] = useState(false);
  const [kategori, setKategori] = useState('LØNN');
  const [melding, setMelding] = useState('');

  // Sjekker alle mulige feltnavn fra backend API for navnet
  const visningsNavn = bruker?.navn || bruker?.name || bruker?.full_navn || bruker?.fornavn || 'Frisør';
  const visningsEpost = bruker?.email || bruker?.epost || '';

  const handterSend = () => {
    if (!melding.trim()) {
      Alert.alert("Mangler tekst", "Du må skrive en beskjed før du kan sende henvendelsen.");
      return;
    }
    Alert.alert("Sendt! 🚀", `Ditt spørsmål om ${kategori.toLowerCase()} er sendt til ledelsen.`);
    setMelding(''); 
    setViserSupport(false); 
  };

  return (
    <View className="flex-1 flex-row bg-[#111827]/80">
      
      {/* VENSTRE SIDE (Lukkeklikk) */}
      <TouchableOpacity 
        className="w-[15%] h-full" 
        activeOpacity={1}
        onPress={() => setAktivSkjerm('DASHBOARD')} 
      />

      {/* HØYRE SIDE (Selve menyen) */}
      <View className="w-[85%] h-full bg-[#F7F7F6] rounded-l-[40px] shadow-lg flex-col">
        
        {/* HEADER */}
        <View className="pt-16 px-6 pb-6 border-b border-[#E5E5E4] flex-row justify-between items-start">
          {viserSupport ? (
            <View className="flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={() => setViserSupport(false)}
                className="w-10 h-10 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm"
              >
                <Feather name="arrow-left" size={18} color="#111827" />
              </TouchableOpacity>
              <Text className="text-xl font-black text-[#111827]">HR / Lønn</Text>
            </View>
          ) : (
            <View className="flex-col gap-3">
              <View className="w-20 h-20 rounded-full bg-[#E5E5E4] border-4 border-white shadow-sm overflow-hidden">
                <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} className="w-full h-full" />
              </View>
              <View>
                <Text className="text-xl font-black text-[#111827]">
                  {visningsNavn}
                </Text>
                {visningsEpost ? (
                  <Text className="text-xs font-medium text-gray-500">
                    {visningsEpost}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
          
          <TouchableOpacity 
            onPress={() => setAktivSkjerm('DASHBOARD')}
            className="w-8 h-8 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm"
          >
            <Feather name="x" size={16} color="#4b5563" />
          </TouchableOpacity>
        </View>

        {viserSupport ? (
          // SKJEMA-VISNING
          <View className="flex-1">
            <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
              <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">Hva gjelder det?</Text>

              <TouchableOpacity onPress={() => setKategori('LØNN')} className={`flex-row items-center justify-between p-4 rounded-[20px] mb-3 relative ${kategori === 'LØNN' ? 'bg-white border-2 border-[#111827] shadow-sm' : 'bg-transparent border border-[#DCDCDA]'}`}>
                {kategori === 'LØNN' && <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#111827]" />}
                <View className="flex-row items-center gap-3 pl-2">
                  <Text className="text-lg">💸</Text>
                  <View>
                    <Text className="text-sm font-bold text-[#111827]">Lønn & Utbetaling</Text>
                    <Text className="text-[10px] text-gray-500">Spørsmål om slipp</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setKategori('PROVISJON')} className={`flex-row items-center justify-between p-4 rounded-[20px] mb-3 relative ${kategori === 'PROVISJON' ? 'bg-white border-2 border-[#111827] shadow-sm' : 'bg-transparent border border-[#DCDCDA]'}`}>
                {kategori === 'PROVISJON' && <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#111827]" />}
                <View className="flex-row items-center gap-3 pl-2">
                  <Text className="text-lg">📈</Text>
                  <View>
                    <Text className="text-sm font-bold text-[#111827]">Provisjon & Salg</Text>
                    <Text className="text-[10px] text-gray-500">Manglende salg e.l.</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setKategori('TIPS')} className={`flex-row items-center justify-between p-4 rounded-[20px] mb-6 relative ${kategori === 'TIPS' ? 'bg-white border-2 border-[#111827] shadow-sm' : 'bg-transparent border border-[#DCDCDA]'}`}>
                {kategori === 'TIPS' && <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#111827]" />}
                <View className="flex-row items-center gap-3 pl-2">
                  <Text className="text-lg">💰</Text>
                  <View>
                    <Text className="text-sm font-bold text-[#111827]">Tips & Bonus</Text>
                    <Text className="text-[10px] text-gray-500">Fordeling av tips</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <Text className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">Din beskjed</Text>
              <TextInput 
                multiline
                textAlignVertical="top"
                value={melding}
                onChangeText={setMelding}
                placeholder="Skriv beskjeden din her..."
                placeholderTextColor="#9ca3af"
                className="w-full bg-white border border-[#DCDCDA] rounded-[20px] p-4 text-sm font-medium text-[#111827] h-32 shadow-sm mb-6"
              />
            </ScrollView>
            
            <View className="px-6 pb-10 pt-4">
              <TouchableOpacity onPress={handterSend} className="w-full bg-[#111827] p-4 rounded-[20px] flex-row items-center justify-center gap-2 shadow-sm">
                <Feather name="send" size={16} color="white" />
                <Text className="text-white font-bold text-xs uppercase tracking-widest">Send inn</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // HOVEDMENY-VISNING
          <>
            <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
              
              <Text className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Arbeid</Text>
              <View className="flex-col gap-2 mb-8">
                <TouchableOpacity onPress={() => setAktivSkjerm('OPPGAVER')} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center gap-3"><Text className="text-xl">✅</Text><Text className="font-bold text-[#111827] text-sm">Oppgaver</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAktivSkjerm('VAKTER')} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center gap-3"><Text className="text-xl">📅</Text><Text className="font-bold text-[#111827] text-sm">Vakter</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAktivSkjerm('FRAVAER')} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center gap-3"><Text className="text-xl">🏖️</Text><Text className="font-bold text-[#111827] text-sm">Fravær</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <Text className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Min konto</Text>
              <View className="flex-col gap-2 mb-8">
                <TouchableOpacity onPress={() => setAktivSkjerm('PERSONALIA')} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center gap-3"><Text className="text-xl">👤</Text><Text className="font-bold text-[#111827] text-sm">Personalia</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAktivSkjerm('UTSTYR')} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm relative">
                  <View className="absolute top-4 right-10 w-2 h-2 bg-red-500 rounded-full" />
                  <View className="flex-row items-center gap-3"><Text className="text-xl">✂️</Text><Text className="font-bold text-[#111827] text-sm">Mitt utstyr</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <Text className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Bedrift</Text>
              <View className="flex-col gap-2">
                <TouchableOpacity onPress={() => setAktivSkjerm('DOKUMENTER')} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center gap-3"><Text className="text-xl">📄</Text><Text className="font-bold text-[#111827] text-sm">Dokumenter & Kontrakt</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAktivSkjerm('HANDBOK')} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center gap-3"><Text className="text-xl">📘</Text><Text className="font-bold text-[#111827] text-sm">Personalhåndbok</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => setViserSupport(true)} className="w-full bg-white border border-[#DCDCDA] p-4 rounded-[20px] flex-row items-center justify-between shadow-sm mt-2">
                  <View className="flex-row items-center gap-3"><Text className="text-xl">💬</Text><Text className="font-bold text-[#111827] text-sm">Kontakt HR / Support</Text></View>
                  <Feather name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View className="px-6 pb-10 pt-4">
              <TouchableOpacity onPress={() => setAktivSkjerm('LOGIN')} className="w-full bg-[#111827] p-4 rounded-[20px] flex-row items-center justify-center gap-2 shadow-sm">
                <Feather name="log-out" size={18} color="white" />
                <Text className="text-white font-bold text-xs uppercase tracking-widest">Logg ut</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}