import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BetalingView({ handlekurv, setHandlekurv, setAktivSkjerm, token, aktivAvdeling }: any) {
  const [steg, setSteg] = useState<'BETALING' | 'TIPS'>('BETALING'); 
  
  const [valgtMetode, setValgtMetode] = useState('kort');
  const [laster, setLaster] = useState(false);
  const [tips, setTips] = useState('');

  const [erDelebetaling, setErDelebetaling] = useState(false);
  const [delbelop, setDelbelop] = useState({ kort: '', vipps: '', kontant: '', gavekort: '' });

  const totalAntall = handlekurv ? handlekurv.length : 0;
  const totalPris = handlekurv ? handlekurv.reduce((sum: number, item: any) => sum + item.pris, 0) : 0;
  const tipsVerdi = Number(tips) || 0;
  const totalMedTips = totalPris + tipsVerdi;

  const getSumInntastet = () => {
    return (Number(delbelop.kort) || 0) + 
           (Number(delbelop.vipps) || 0) + 
           (Number(delbelop.kontant) || 0) + 
           (Number(delbelop.gavekort) || 0);
  };
  const gjenstaende = totalPris - getSumInntastet();
  const kanGaaVidereFraBetaling = erDelebetaling ? gjenstaende === 0 : true;

  const gjennomforBetaling = async () => {
    if (totalAntall === 0) {
      Alert.alert("Tom kurv", "Du må legge til varer før du kan betale.");
      return;
    }

    setLaster(true);
    let altGikkBra = true;
    let serverMelding = '';
    let tipsLagtTil = false;

    const transaksjonsRef = "TX-" + Date.now();

    let gjenstaendeBetalinger: { metode: string; belop: number }[] = [];
    
    if (erDelebetaling) {
      for (const [metode, belop] of Object.entries(delbelop)) {
        const num = Number(belop);
        if (num > 0) {
          gjenstaendeBetalinger.push({ metode, belop: num });
        }
      }
    } else {
      gjenstaendeBetalinger.push({ metode: valgtMetode, belop: totalPris });
    }

    for (const vare of handlekurv) {
      let varePrisGjenstaende = vare.pris;
      // Sjekker om prisen er endret fra originalen!
      const erRabattert = vare.originalPris !== undefined && vare.originalPris !== vare.pris;

      if (varePrisGjenstaende === 0) {
        const gratisMetode = erDelebetaling 
          ? (gjenstaendeBetalinger.length > 0 ? gjenstaendeBetalinger[0].metode : 'kort') 
          : valgtMetode;
          
        try {
          const response = await fetch('https://api.cutcount.no/api/salg/registrer', {
            method: 'POST',
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
              type: vare.type, 
              belop_brutto: 0,
              antall: 1,
              tips: !tipsLagtTil ? tipsVerdi : 0, 
              avdeling_id: aktivAvdeling.id,
              tjeneste: vare.navn,
              betalingsmetode: gratisMetode,
              referanse: transaksjonsRef,
              standard_pris: vare.originalPris || 0, // 👈 Sender originalpris
              manuelt_overstyrt: erRabattert         // 👈 Sender rabatt-flagg
            })
          });
          
          if (!response.ok) {
            altGikkBra = false;
            const errorData = await response.json();
            serverMelding = errorData.melding || 'Noe gikk galt under registreringen.';
          }
          tipsLagtTil = true;
        } catch (error) {
          altGikkBra = false;
        }
        continue; 
      }

      while (varePrisGjenstaende > 0 && gjenstaendeBetalinger.length > 0) {
        let aktivBetaling = gjenstaendeBetalinger[0];
        let trekkBelop = 0;

        if (aktivBetaling.belop >= varePrisGjenstaende) {
          trekkBelop = varePrisGjenstaende;
          aktivBetaling.belop -= varePrisGjenstaende;
          varePrisGjenstaende = 0;
          
          if (aktivBetaling.belop === 0) {
            gjenstaendeBetalinger.shift();
          }
        } else {
          trekkBelop = aktivBetaling.belop;
          varePrisGjenstaende -= aktivBetaling.belop;
          gjenstaendeBetalinger.shift();
        }

        const tjenesteNavn = trekkBelop < vare.pris ? `${vare.navn} (Delt)` : vare.navn;
        const tipsAASende = !tipsLagtTil ? tipsVerdi : 0;
        tipsLagtTil = true;

        try {
          const response = await fetch('https://api.cutcount.no/api/salg/registrer', {
            method: 'POST',
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
              type: vare.type, 
              belop_brutto: trekkBelop,
              antall: 1,
              tips: tipsAASende, 
              avdeling_id: aktivAvdeling.id,
              tjeneste: tjenesteNavn,
              betalingsmetode: aktivBetaling.metode,
              referanse: transaksjonsRef,
              standard_pris: vare.originalPris || vare.pris, // 👈 Sender originalpris
              manuelt_overstyrt: erRabattert                 // 👈 Sender rabatt-flagg
            })
          });

          if (!response.ok) {
            altGikkBra = false;
            const errorData = await response.json();
            serverMelding = errorData.melding || 'Noe gikk galt under registreringen.';
          }
        } catch (error) {
          altGikkBra = false;
        }
      }
    }

    setLaster(false);

    if (altGikkBra) {
      Alert.alert(
        'Suksess! 💰', 
        'Salget er registrert i regnskapet!',
        [
          {
            text: 'OK',
            onPress: () => {
              setHandlekurv([]); 
              setAktivSkjerm('DASHBOARD'); 
            }
          }
        ]
      );
    } else {
      Alert.alert('Betaling stoppet 🛑', serverMelding || 'Kunne ikke registrere salget.');
    }
  };

  const handterTilbake = () => {
    if (steg === 'TIPS') {
      setSteg('BETALING'); 
    } else {
      setAktivSkjerm('MENY'); 
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-[#F7F7F6]"
    >
      <View className="pt-14 px-6 pb-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={handterTilbake}
          className="w-10 h-10 bg-white border border-[#DCDCDA] rounded-full flex items-center justify-center shadow-sm"
        >
          <Feather name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        
        <Text className="text-xl font-black text-[#111827] tracking-tight">
          {steg === 'BETALING' ? 'Betaling' : 'Tips'}
        </Text>
        
        <TouchableOpacity className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
          <Feather name="settings" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pt-4 flex-1" showsVerticalScrollIndicator={false}>
        
        {steg === 'BETALING' && (
          <View className="pb-8">
            <View className={`w-full rounded-[32px] p-8 items-center justify-center shadow-xl mb-8 overflow-hidden relative ${erDelebetaling && gjenstaende === 0 ? 'bg-green-600' : 'bg-[#111827]'}`}>
              <View className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-white/5 rounded-full" />
              <View className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-white/5 rounded-full" />
              
              <Text className="text-xs font-bold tracking-widest text-gray-300 uppercase mb-2">
                {erDelebetaling ? (gjenstaende === 0 ? 'Ferdig fordelt' : 'Gjenstår å fordele') : 'Å betale'}
              </Text>
              
              <View className="flex-row items-end gap-1 mb-4">
                <Text className="text-6xl font-black text-white">{erDelebetaling ? gjenstaende : totalPris}</Text>
                <Text className="text-3xl font-black text-gray-300 pb-1">,-</Text>
              </View>
            </View>

            {!erDelebetaling ? (
              <>
                <Text className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 text-center">Velg betalingsmetode</Text>
                <View className="flex-row flex-wrap justify-between gap-y-4">
                  {['kort', 'vipps', 'kontant', 'gavekort'].map((metode) => (
                    <TouchableOpacity 
                      key={metode}
                      onPress={() => setValgtMetode(metode)}
                      className={`w-[48%] aspect-square rounded-[24px] flex items-center justify-center border-2 ${valgtMetode === metode ? 'bg-[#111827] border-[#111827]' : 'bg-white border-[#DCDCDA]'}`}
                    >
                      <View className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${valgtMetode === metode ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <Feather name={metode === 'kort' ? 'credit-card' : metode === 'vipps' ? 'smile' : metode === 'kontant' ? 'dollar-sign' : 'gift'} size={24} color={valgtMetode === metode ? 'white' : '#111827'} />
                      </View>
                      <Text className={`text-sm font-black tracking-widest uppercase ${valgtMetode === metode ? 'text-white' : 'text-[#111827]'}`}>{metode}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <View className="flex-col gap-3">
                <Text className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 text-center">Tast inn beløp per metode</Text>
                {['kort', 'vipps', 'kontant', 'gavekort'].map((metode) => (
                  <View key={metode} className="flex-row items-center bg-white border border-[#DCDCDA] rounded-[20px] p-3 shadow-sm">
                    <View className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <Feather name={metode === 'kort' ? 'credit-card' : metode === 'vipps' ? 'smile' : metode === 'kontant' ? 'dollar-sign' : 'gift'} size={20} color="#111827" />
                    </View>
                    <Text className="text-sm font-bold text-[#111827] uppercase flex-1">{metode}</Text>
                    <TextInput
                      placeholder="0"
                      keyboardType="numeric"
                      returnKeyType="done"
                      value={delbelop[metode as keyof typeof delbelop]}
                      onChangeText={(verdi) => setDelbelop({...delbelop, [metode]: verdi})}
                      className="bg-[#F7F7F6] text-right font-black text-xl text-[#111827] px-4 py-2 rounded-xl border border-[#E5E5E4] min-w-[100px]"
                    />
                    <Text className="text-sm font-bold text-gray-500 ml-2">,-</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {steg === 'TIPS' && (
          <View className="flex-col items-center justify-center pt-6 pb-10">
            <View className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-yellow-200">
              <Feather name="star" size={42} color="#ca8a04" />
            </View>
            
            <Text className="text-2xl font-black text-[#111827] mb-2 text-center tracking-tight">Fikk du tips?</Text>
            <Text className="text-sm font-bold text-gray-500 mb-8 text-center uppercase tracking-widest">Velg et beløp eller tast inn</Text>

            <View className="flex-row flex-wrap justify-center gap-3 mb-8 w-full px-2">
              {[20, 50, 75, 100].map(belop => (
                <TouchableOpacity 
                  key={belop}
                  onPress={() => setTips(belop.toString())}
                  className={`w-[46%] py-5 rounded-[20px] border-2 shadow-sm ${tips === belop.toString() ? 'bg-[#ca8a04] border-[#ca8a04]' : 'bg-white border-[#E5E5E4]'}`}
                >
                  <Text className={`text-xl text-center font-black ${tips === belop.toString() ? 'text-white' : 'text-[#111827]'}`}>{belop},-</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="w-full flex-row items-center bg-white border border-[#DCDCDA] rounded-[24px] p-4 shadow-sm mb-4">
              <Text className="text-sm font-bold text-[#111827] uppercase flex-1 ml-2 tracking-widest">Annet beløp</Text>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                returnKeyType="done"
                value={tips}
                onChangeText={setTips}
                className="bg-[#F7F7F6] text-right font-black text-2xl text-[#ca8a04] px-5 py-3 rounded-[16px] border border-[#E5E5E4] min-w-[120px]"
              />
              <Text className="text-lg font-black text-gray-400 ml-3 mr-1">,-</Text>
            </View>
          </View>
        )}

      </ScrollView>

      <View className="p-6 bg-white border-t border-[#E5E5E4] pb-10">
        
        {steg === 'BETALING' && (
          <>
            <TouchableOpacity 
              onPress={() => {
                setErDelebetaling(!erDelebetaling);
                setDelbelop({ kort: '', vipps: '', kontant: '', gavekort: '' }); 
              }}
              className="w-full bg-white border-2 border-[#DCDCDA] py-4 rounded-[20px] flex items-center justify-center mb-3 flex-row gap-2"
            >
              <Feather name={erDelebetaling ? "x" : "pie-chart"} size={18} color="#111827" />
              <Text className="text-[#111827] text-sm font-black tracking-widest uppercase">
                {erDelebetaling ? "Avbryt delebetaling" : "Dele opp betalingen?"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setSteg('TIPS')} 
              disabled={!kanGaaVidereFraBetaling}
              className={`w-full py-5 rounded-[20px] flex items-center justify-center shadow-lg ${kanGaaVidereFraBetaling ? 'bg-[#111827]' : 'bg-gray-300'}`}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-white text-base font-black tracking-widest uppercase">
                  {kanGaaVidereFraBetaling ? 'Gå videre' : 'Fordel hele summen først'}
                </Text>
                <Feather name={kanGaaVidereFraBetaling ? "arrow-right" : "lock"} size={20} color="white" />
              </View>
            </TouchableOpacity>
          </>
        )}

        {steg === 'TIPS' && (
          <TouchableOpacity 
            onPress={gjennomforBetaling} 
            disabled={laster}
            className="w-full bg-[#22c55e] py-5 rounded-[20px] flex items-center justify-center shadow-lg"
          >
            {laster ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center justify-center gap-3">
                <Text className="text-white text-lg font-black tracking-widest uppercase">
                  Ta betalt: {totalMedTips},-
                </Text>
                <Feather name="check-circle" size={22} color="white" />
              </View>
            )}
          </TouchableOpacity>
        )}

      </View>
    </KeyboardAvoidingView>
  );
}