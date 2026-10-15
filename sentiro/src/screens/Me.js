import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { C, S, T } from '../theme';

const WALK_SECONDS = 15 * 60;

// Her own screen. Marking it herself is both a backup for a failed automatic
// alert and the reason she keeps the app installed.
export default function MeScreen() {
  const [marked, setMarked] = useState({});
  const [walk, setWalk] = useState(null);
  const walking = walk != null;

  useEffect(() => {
    if (!walking) return;
    const id = setInterval(() => {
      setWalk((s) => (s > 1 ? s - 1 : null));
    }, 1000);
    return () => clearInterval(id);
  }, [walking]);

  function mark(key) {
    setMarked((m) => ({ ...m, [key]: true }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }

  const mm = walking ? String(Math.floor(walk / 60)).padStart(2, '0') : null;
  const ss = walking ? String(walk % 60).padStart(2, '0') : null;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.quick}>
        <Pressable
          style={[styles.qBtn, marked.out && styles.qDone]}
          onPress={() => mark('out')}
        >
          <Text style={styles.qIcon}>{marked.out ? '✓' : '⌂'}</Text>
          <Text style={styles.qTxt}>יצאתי מהבית</Text>
        </Pressable>
        <Pressable
          style={[styles.qBtn, marked.in && styles.qDone]}
          onPress={() => mark('in')}
        >
          <Text style={styles.qIcon}>{marked.in ? '✓' : '◉'}</Text>
          <Text style={styles.qTxt}>הגעתי</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={T.h2}>ליווי בדרך</Text>
        <Text style={T.small}>
          המעגל רואה אותך על המפה חמש עשרה דקות, ואז זה נכבה לבד. לא מעקב כל היום.
        </Text>
        <Pressable
          style={[styles.walkBtn, walking && styles.walkOn]}
          onPress={() => {
            if (!walking) {
              setWalk(WALK_SECONDS);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            } else {
              setWalk(null);
            }
          }}
        >
          <Text style={styles.walkTxt}>
            {walking ? `ליווי פעיל · ${mm}:${ss} · לסיום` : 'התחילי ליווי'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={T.h2}>המעגל שלי</Text>
        <Text style={T.small}>אמא, אבא ויעל רואים את ההתראות שלי.</Text>
        <Text style={T.small}>רונית, השכנה: רק ברגע מצוקה.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: S.gutter, gap: 12 },
  quick: { flexDirection: 'row-reverse', gap: 10 },
  qBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: S.radiusLg,
    backgroundColor: C.surface,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 6,
  },
  qDone: { borderColor: C.safe, backgroundColor: '#EAF6EE' },
  qIcon: { fontSize: 20, color: C.brand },
  qTxt: { ...T.body, fontSize: 14, fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: S.radiusLg,
    backgroundColor: C.surface,
    padding: 14,
    gap: 6,
  },
  walkBtn: {
    marginTop: 4,
    backgroundColor: C.brand,
    borderRadius: S.radius,
    paddingVertical: 12,
    alignItems: 'center',
  },
  walkOn: { backgroundColor: C.safe },
  walkTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
