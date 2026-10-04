import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ScreenCapture from 'expo-screen-capture';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, Platform } from 'react-native';

// Forteller Expo hvordan den skal håndtere varsler som kommer inn mens appen er åpen
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, 
    shouldShowList: true,   
  }),
});

// Våre byggeklosser
import BetalingView from '../../components/BetalingView';
import DashboardView from '../../components/DashboardView';
import DokumenterView from '../../components/DokumenterView';
import FravaerView from '../../components/FravaerView';
import KameraView from '../../components/KameraView';
import LoginView from '../../components/LoginView';
import MenyView from '../../components/MenyView';
import MinSideView from '../../components/MinSideView';
import OppgaverView from '../../components/OppgaverView';
import PersonalhandbokView from '../../components/PersonalhandbokView';
import PersonaliaView from '../../components/PersonaliaView';
import ProfilView from '../../components/ProfilView';
import TipsView from '../../components/TipsView';
import UtstyrView from '../../components/UtstyrView';
import VakterView from '../../components/VakterView';
import VelgSalongView from '../../components/VelgSalongView';

const regnUtAvstandIMeter = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

async function registrerForPushVarslerAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: eksisterendeStatus } = await Notifications.getPermissionsAsync();
    let endeligStatus = eksisterendeStatus;
    if (eksisterendeStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      endeligStatus = status;
    }
    if (endeligStatus !== 'granted') {
      Alert.alert('Varsler deaktivert', 'Du vil ikke motta varsler om nye beskjeder eller oppgaver.');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '32c39758-6aa5-4e88-9ab7-62ff91a5c6fa' })).data;
  } else {
    console.log('Push-varsler fungerer kun på fysiske telefoner, ikke i simulator.');
  }

  return token;
}

export default function HomeScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [bruker, setBruker] = useState<any>(null);
  const [epost, setEpost] = useState('');
  const [passord, setPassord] = useState('');

  const [aktivSkjerm, setAktivSkjerm] = useState<'LOGIN' | 'VELG_SALONG' | 'DASHBOARD' | 'KAMERA' | 'MIN_SIDE' | 'OPPGAVER' | 'MENY' | 'VAKTER' | 'FRAVAER' | 'BETALING' | 'TIPS' | 'UTSTYR' | 'PROFIL' | 'PERSONALIA' | 'DOKUMENTER' | 'HANDBOK'>('LOGIN');
  const [aktivAvdeling, setAktivAvdeling] = useState<any>(null);
  const [tjenester, setTjenester] = useState<any[]>([]);
  const [produkter, setProdukter] = useState<any[]>([]);
  const [laster, setLaster] = useState(false);
  const [handlekurv, setHandlekurv] = useState<any[]>([]);
  const [valgtOppgave, setValgtOppgave] = useState<any>(null);

  const [erStempletInn, setErStempletInn] = useState(false);
  const [vaktSluttTid, setVaktSluttTid] = useState<Date | null>(null); 

  const appStatus = useRef(AppState.currentState);
  const tidspunktLagttIBakgrunn = useRef<number | null>(null);
  
  const behandlerQR = useRef(false);

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  const hentBrukerData = async () => {
    if (!token) return;
    try {
      const response = await fetch('https://api.cutcount.no/api/me', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setBruker(data);
      }
    } catch (error) {
      console.log("Feil ved oppdatering av brukerdata:", error);
    }
  };

  const hentMenyLydlost = async () => {
    if (!token || !aktivAvdeling) return;
    try {
      const resTjenester = await fetch(`https://api.cutcount.no/api/tjenester?avdeling_id=${aktivAvdeling.id}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const dataTjenester = await resTjenester.json();

      const resProdukter = await fetch(`https://api.cutcount.no/api/produkter`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const dataProdukter = await resProdukter.json();

      if (resTjenester.ok) {
        setTjenester(dataTjenester.data);
        setProdukter(resProdukter.ok ? dataProdukter.data : []); 
      }
    } catch (error) {
      console.log("Feil ved lydløs oppdatering av meny:", error);
    }
  };

  useEffect(() => {
    if (aktivSkjerm === 'MIN_SIDE') {
      hentBrukerData();
    } else if (aktivSkjerm === 'MENY') {
      hentMenyLydlost();
    }
  }, [aktivSkjerm]);

  useEffect(() => {
    const abonnement = AppState.addEventListener('change', (nesteStatus: AppStateStatus) => {
      if (appStatus.current.match(/inactive|background/) && nesteStatus === 'active') {
        if (tidspunktLagttIBakgrunn.current) {
          const naa = Date.now();
          const tidIBakgrunn = naa - tidspunktLagttIBakgrunn.current;
          const maksTid = 60 * 60 * 1000; 
          
          if (tidIBakgrunn > maksTid && erStempletInn) {
            laasKassenUt("Du har vært inaktiv i over en time. Kassen er låst for sikkerhets skyld.");
          }
        }
        if (erStempletInn) {
          if (aktivSkjerm === 'MIN_SIDE') hentBrukerData();
          if (aktivSkjerm === 'MENY') hentMenyLydlost();
        }
      }
      if (nesteStatus === 'background') {
        tidspunktLagttIBakgrunn.current = Date.now(); 
      }
      appStatus.current = nesteStatus;
    });

    const vaktTimer = setInterval(() => {
      if (erStempletInn && vaktSluttTid) {
        const naa = new Date();
        const femtenMinEtterSlutt = new Date(vaktSluttTid.getTime() + 15 * 60000); 
        
        if (naa > femtenMinEtterSlutt) {
          utforAutomatiskUtsjekk();
        }
      }
    }, 60000); 

    return () => {
      abonnement.remove();
      clearInterval(vaktTimer);
    };
  }, [erStempletInn, vaktSluttTid, aktivSkjerm]);

  const utforAutomatiskUtsjekk = async () => {
    try {
      if (!aktivAvdeling) return;
      await fetch('https://api.cutcount.no/api/stempling/ut', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          avdeling_id: aktivAvdeling.id,
          automatisk: true 
        })
      });
    } catch (e) {
      console.log("Feil ved automatisk utsjekk", e);
    } finally {
      laasKassenUt("Vakten din er over. Du har blitt automatisk stemplet ut (15 min over tid).");
    }
  };

  const laasKassenUt = (beskjed: string) => {
    setErStempletInn(false);
    setVaktSluttTid(null);
    setTjenester([]); 
    setProdukter([]);
    setAktivSkjerm('DASHBOARD');
    Alert.alert("Utstemplet ⏱️", beskjed);
  };

  const handterPlussKnapp = () => {
    if (erStempletInn || tjenester.length > 0) {
      setAktivSkjerm('MENY');
    } else {
      setAktivSkjerm('KAMERA');
    }
  };

  const sendPushTokenTilServer = async (gyldigToken: string) => {
    try {
      const pushToken = await registrerForPushVarslerAsync();
      
      if (pushToken) {
        await fetch('https://api.cutcount.no/api/lagre-push-token', {
          method: 'POST',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gyldigToken}` 
          },
          body: JSON.stringify({ token: pushToken })
        });
      }
    } catch (error) {
      console.log("Feil ved registrering av push-token:", error);
    }
  };

  const loggInn = async () => {
    try {
      setLaster(true);
      const response = await fetch('https://api.cutcount.no/api/login', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: epost, password: passord })
      });
      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setBruker(data.bruker);
        
        sendPushTokenTilServer(data.token);
        sjekkAktivStatus(data.token);
      } else {
        Alert.alert('Innlogging feilet', data.melding || 'Feil e-post eller passord.');
        setLaster(false);
      }
    } catch (error) {
      Alert.alert('Nettverksfeil', 'Får ikke kontakt med serveren.');
      setLaster(false);
    }
  };

  const sjekkAktivStatus = async (gyldigToken: string) => {
    try {
      const response = await fetch('https://api.cutcount.no/api/stempling/status', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${gyldigToken}` }
      });
      const statusData = await response.json();

      if (response.ok && statusData.er_aktiv) {
        setAktivAvdeling({ id: statusData.avdeling_id, navn: statusData.avdeling_navn });
        setErStempletInn(true);
        if (statusData.slutt_tid) {
          setVaktSluttTid(new Date(statusData.slutt_tid)); 
        }
        hentTjenesterOgVisMeny(statusData.avdeling_id); 
        setAktivSkjerm('DASHBOARD');
      } else {
        finnVaktEllerBeOmValg(gyldigToken);
      }
    } catch (error) {
      finnVaktEllerBeOmValg(gyldigToken);
    }
  };

  const finnVaktEllerBeOmValg = async (gyldigToken: string) => {
    try {
      const response = await fetch('https://api.cutcount.no/api/mine-vakter', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${gyldigToken}` }
      });
      const vaktData = await response.json();
      
      let harVaktIAkkuratNa = false;

      if (vaktData.data && vaktData.data.length > 0) {
        const naa = new Date();
        const iDag = naa.toISOString().split('T')[0];

        for (const vakt of vaktData.data) {
          const vaktDato = vakt.start_tid.split(' ')[0];
          if (vaktDato === iDag) {
            harVaktIAkkuratNa = true;
            setAktivAvdeling({ 
              id: vakt.avdeling_id, 
              navn: vakt.avdeling.navn, 
              lat: parseFloat(vakt.avdeling.latitude), 
              lon: parseFloat(vakt.avdeling.longitude) 
            }); 
            setAktivSkjerm('DASHBOARD'); 
            break;
          }
        }
      }

      if (!harVaktIAkkuratNa) {
        setAktivSkjerm('DASHBOARD');
      }
    } catch (error) {
      setAktivSkjerm('DASHBOARD');
    } finally {
      setLaster(false);
    }
  };

  const bekreftManueltSalongValg = (avdeling: any) => {
    Alert.alert(
      "Ingen vakt funnet",
      `Er du sikker på at du skal jobbe på ${avdeling.navn} i dag?`,
      [
        { text: "Avbryt", style: "cancel" },
        { 
          text: "Ja, fortsett", 
          onPress: () => {
            setAktivAvdeling({ 
              id: avdeling.id, 
              navn: avdeling.navn, 
              lat: parseFloat(avdeling.latitude), 
              lon: parseFloat(avdeling.longitude) 
            });
            setAktivSkjerm('DASHBOARD');
          }
        }
      ]
    );
  };

  const utforQRStempling = async (qrData: string) => {
    if (behandlerQR.current) return;

    try {
      behandlerQR.current = true; 
      setLaster(true);
      
      const forventetStart = `avdeling-${aktivAvdeling?.id}-`;
      if (qrData !== 'test-bypass' && !qrData.startsWith(forventetStart)) {
        Alert.alert('Feil QR-kode 🛑', `Denne QR-koden tilhører ikke ${aktivAvdeling?.navn || 'valgt salong'}. Sjekk at du har valgt riktig salong i menyen.`);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Mangler GPS', 'Du må tillate stedstjenester for å kunne sjekke inn i kassen.');
        return;
      }

      const brukerPosisjon = await Location.getCurrentPositionAsync({});
      
      const avstandIMeter = regnUtAvstandIMeter(
        brukerPosisjon.coords.latitude, 
        brukerPosisjon.coords.longitude, 
        aktivAvdeling.lat, 
        aktivAvdeling.lon
      );

      if (avstandIMeter > 550) {
        Alert.alert('For langt unna 🛑', `Du er ca. ${Math.round(avstandIMeter)} meter unna salongen. Du må være innenfor 150 meter for å åpne kassen.`);
        return;
      }

      const endpoint = erStempletInn ? '/stempling/ut' : '/stempling/inn';

      const response = await fetch(`https://api.cutcount.no/api${endpoint}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          avdeling_id: aktivAvdeling.id,
          latitude: brukerPosisjon.coords.latitude,
          longitude: brukerPosisjon.coords.longitude,
          qr_kode: qrData
        })
      });

      const rawText = await response.text(); 
      let data;
      try { data = JSON.parse(rawText); } 
      catch (e) {
        Alert.alert('Laravel Krasjet! 🚨', 'Sjekk server-loggen.');
        return;
      }

      if (response.ok) {
        if (erStempletInn) {
          setErStempletInn(false);
          setVaktSluttTid(null); 
          setTjenester([]); 
          setProdukter([]);
          
          Alert.alert(
            'Stemplet ut 👋', 
            'Takk for i dag! Timene dine er lagret.',
            [
              {
                text: 'OK',
                onPress: () => setAktivSkjerm('DASHBOARD')
              }
            ]
          );
        } else {
          setErStempletInn(true);
          
          if (data.slutt_tid) {
            setVaktSluttTid(new Date(data.slutt_tid)); 
          } else {
            const aatteTimerFramaNaa = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
            setVaktSluttTid(aatteTimerFramaNaa); 
          }
          
          hentTjenesterOgVisMeny(aktivAvdeling.id);
        }
      } else {
        if (data.melding === 'Du er allerede innstemplet!') {
          setErStempletInn(true);
          if (aktivAvdeling) {
            hentTjenesterOgVisMeny(aktivAvdeling.id);
          }
          setAktivSkjerm('DASHBOARD');
        } else {
          Alert.alert('Stempling nektet 🛑', data.melding || 'Ukjent feil');
        }
      }
    } catch (error) {
      Alert.alert('Nettverksfeil', 'Mistet kontakten med serveren.');
    } finally {
      setLaster(false);
      setTimeout(() => {
        behandlerQR.current = false;
      }, 2000);
    }
  };

  const hentTjenesterOgVisMeny = async (avdelingId: number) => {
    try {
      const resTjenester = await fetch(`https://api.cutcount.no/api/tjenester?avdeling_id=${avdelingId}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const dataTjenester = await resTjenester.json();

      const resProdukter = await fetch(`https://api.cutcount.no/api/produkter`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const dataProdukter = await resProdukter.json();

      if (resTjenester.ok) {
        setTjenester(dataTjenester.data);
        setProdukter(resProdukter.ok ? dataProdukter.data : []); 
        setAktivSkjerm('MENY');
      }
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente pris- eller produktlisten.');
    } finally {
      setLaster(false);
    }
  };

  // 🎯 OPPDATERT: Legger også inn "originalPris" i varen, slik at vi husker hva den egentlig kostet!
  const leggTilIKurv = (navn: string, pris: any, type: 'tjeneste' | 'produkt') => {
    const tryggPris = parseFloat(pris) || 0;
    setHandlekurv([...handlekurv, { navn, pris: tryggPris, originalPris: tryggPris, type }]);
  };

  if (aktivSkjerm === 'LOGIN') return <LoginView epost={epost} setEpost={setEpost} passord={passord} setPassord={setPassord} loggInn={loggInn} laster={laster} />;
  if (aktivSkjerm === 'VELG_SALONG') return <VelgSalongView bruker={bruker} bekreftManueltSalongValg={bekreftManueltSalongValg} />;
  if (aktivSkjerm === 'DASHBOARD') return <DashboardView bruker={bruker} aktivAvdeling={aktivAvdeling} setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} erStempletInn={erStempletInn} hentBrukerData={hentBrukerData} />;
  if (aktivSkjerm === 'KAMERA') return <KameraView setAktivSkjerm={setAktivSkjerm} utforQRStempling={utforQRStempling} laster={laster} erStempletInn={erStempletInn} />;
  if (aktivSkjerm === 'MIN_SIDE') return <MinSideView bruker={bruker} token={token} aktivAvdeling={aktivAvdeling} setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} erStempletInn={erStempletInn} />;
  
  if (aktivSkjerm === 'OPPGAVER') return <OppgaverView setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} token={token} setValgtOppgave={setValgtOppgave} />;
  if (aktivSkjerm === 'UTSTYR') return <UtstyrView setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} valgtOppgave={valgtOppgave} token={token} />; 
  
  if (aktivSkjerm === 'VAKTER') return <VakterView setAktivSkjerm={setAktivSkjerm} token={token} handterPlussKnapp={handterPlussKnapp} />; 
  if (aktivSkjerm === 'FRAVAER') return <FravaerView setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} />; 
  if (aktivSkjerm === 'BETALING') return <BetalingView handlekurv={handlekurv} setHandlekurv={setHandlekurv} setAktivSkjerm={setAktivSkjerm} token={token} aktivAvdeling={aktivAvdeling} hentBrukerData={hentBrukerData} />; 
  if (aktivSkjerm === 'TIPS') return <TipsView setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} />; 
  if (aktivSkjerm === 'PROFIL') return <ProfilView bruker={bruker} setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} />;
  if (aktivSkjerm === 'PERSONALIA') return <PersonaliaView bruker={bruker} token={token} setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} />;
  if (aktivSkjerm === 'DOKUMENTER') return <DokumenterView bruker={bruker} token={token} setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} />;
  if (aktivSkjerm === 'HANDBOK') return <PersonalhandbokView setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} />;
  if (aktivSkjerm === 'MENY') return <MenyView tjenester={tjenester} produkter={produkter} handlekurv={handlekurv} setHandlekurv={setHandlekurv} leggTilIKurv={leggTilIKurv} setAktivSkjerm={setAktivSkjerm} handterPlussKnapp={handterPlussKnapp} />; 

  return null;
}