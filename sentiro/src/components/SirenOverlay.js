import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';

const SIREN = require('../../assets/siren.wav');
const STOP_CODE = '1234';

// The circle alert cannot be recalled once sent. The code stops the siren only.
export default function SirenOverlay({ onResolved }) {
  const player = useAudioPlayer(SIREN);
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);
  const [acks, setAcks] = useState([]);
  const flash = useRef(new Animated.Value(0)).current;
  const timers = useRef([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'doNotMix' });
      } catch {
        // Playing at a lower effective volume is better than not sounding at all.
      }
      if (cancelled) return;
      try {
        player.loop = true;
        player.volume = 1;
        player.play();
      } catch {
        // Nothing to recover to here; the overlay and the circle alert still stand.
      }
    })();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flash, { toValue: 1, duration: 350, useNativeDriver: false }),
        Animated.timing(flash, { toValue: 0, duration: 350, useNativeDriver: false }),
      ])
    );
    loop.start();

    const incoming = [
      { name: 'אמא', text: 'ראתה' },
      { name: 'אבא', text: 'ראה' },
      { name: 'יעל', text: 'בדרך אלייך' },
    ];
    incoming.forEach((a, i) => {
      timers.current.push(
        setTimeout(() => {
          setAcks((prev) => [...prev, { ...a, at: 5 + i * 6 }]);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }, 2500 + i * 3500)
      );
    });

    return () => {
      cancelled = true;
      loop.stop();
      timers.current.forEach(clearTimeout);
      timers.current = [];
      try {
        player.pause();
      } catch {
        // Already stopped.
      }
    };
    // Deliberately mount-only: re-running this would restart the siren mid-emergency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(value) {
    if (value === STOP_CODE) {
      try {
        player.pause();
      } catch {
        // Already stopped.
      }
      onResolved();
      return;
    }
    setWrong(true);
    setCode('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }

  const bg = flash.interpolate({ inputRange: [0, 1], outputRange: ['#C0210F', '#2A0400'] });

  return (
    <Animated.View style={[styles.wrap, { backgroundColor: bg }]}>
      <Text style={styles.h}>צופר פועל</Text>
      <Text style={styles.sub}>המעגל קיבל את המיקום שלך</Text>

      <View style={styles.acks}>
        {acks.length === 0 ? (
          <View style={styles.waiting}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.waitingTxt}>שולחת למעגל</Text>
          </View>
        ) : (
          acks.map((a) => (
            <Text key={a.name} style={styles.ack}>
              {a.name} · {a.text} · לפני {a.at} שניות
            </Text>
          ))
        )}
      </View>

      <View style={styles.stopRow}>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={(v) => {
            setWrong(false);
            setCode(v);
            if (v.length === 4) submit(v);
          }}
          keyboardType="number-pad"
          maxLength={4}
          placeholder={wrong ? 'לא נכון' : 'קוד'}
          placeholderTextColor="#9A9A9A"
          accessibilityLabel="קוד לעצירת הצופר"
        />
        <Pressable style={styles.stopBtn} onPress={() => submit(code)}>
          <Text style={styles.stopTxt}>עצרי צופר</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>
        ההתראה למעגל נשלחה ואי אפשר לבטל אותה. הקוד עוצר רק את הצופר.
      </Text>
      <Text style={styles.demo}>קוד הדגמה: 1234</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  h: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  sub: { color: '#FFFFFF', fontSize: 14, opacity: 0.9 },
  acks: { minHeight: 80, alignItems: 'center', justifyContent: 'center', gap: 5 },
  waiting: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  waitingTxt: { color: '#FFFFFF', fontSize: 14, opacity: 0.9 },
  ack: { color: '#FFFFFF', fontSize: 14 },
  stopRow: { flexDirection: 'row-reverse', gap: 8, marginTop: 4 },
  input: {
    width: 96,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 4,
    color: '#111111',
  },
  stopBtn: {
    backgroundColor: '#111111',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  stopTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  note: {
    color: '#FFFFFF',
    fontSize: 12.5,
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  demo: { color: '#FFFFFF', fontSize: 11, opacity: 0.7 },
});
