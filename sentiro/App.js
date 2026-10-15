import { useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import TodayScreen from './src/screens/Today';
import MeScreen from './src/screens/Me';
import CircleScreen from './src/screens/Circle';
import HoldButton from './src/components/HoldButton';
import SirenOverlay from './src/components/SirenOverlay';
import { C, S, T } from './src/theme';
import { CIRCLE_NAME } from './src/data';

const TABS = [
  { key: 'today', label: 'היום', title: 'היום' },
  { key: 'me', label: 'אני', title: 'אני' },
  { key: 'circle', label: 'מעגל', title: CIRCLE_NAME },
];

export default function App() {
  const [tab, setTab] = useState('today');
  const [siren, setSiren] = useState(false);

  const active = TABS.find((t) => t.key === tab);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={T.title}>{active.title}</Text>
        <Text style={styles.sub}>4 מתוך 5 מחוברים</Text>
      </View>

      <View style={styles.body}>
        {tab === 'today' && <TodayScreen />}
        {tab === 'me' && <MeScreen />}
        {tab === 'circle' && <CircleScreen />}
      </View>

      <View style={styles.sosPill}>
        <HoldButton size={56} onFire={() => setSiren(true)} disabled={siren} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.sosH}>החזיקי שתי שניות</Text>
          <Text style={T.small}>הצופר יישמע וכל המעגל יקבל את המיקום שלך</Text>
        </View>
      </View>

      <View style={styles.tabbar}>
        {TABS.map((t) => {
          const on = t.key === tab;
          return (
            <Pressable
              key={t.key}
              style={styles.tab}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
            >
              <View style={[styles.tabDot, on && styles.tabDotOn]} />
              <Text style={[styles.tabTxt, on && styles.tabTxtOn]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {siren && <SirenOverlay onResolved={() => setSiren(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: S.gutter, paddingTop: 8, paddingBottom: 4 },
  sub: { ...T.small, marginTop: 2 },
  body: { flex: 1 },
  sosPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: S.gutter,
    marginBottom: 8,
    padding: 10,
    borderRadius: S.radiusLg,
    borderWidth: 1,
    borderColor: '#EFC7C1',
    backgroundColor: C.dangerSoft,
  },
  sosH: { ...T.body, fontWeight: '700', fontSize: 15 },
  tabbar: {
    flexDirection: 'row-reverse',
    borderTopWidth: 1,
    borderTopColor: C.line,
    backgroundColor: C.surface,
    paddingTop: 7,
    paddingBottom: 6,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 2 },
  tabDot: { width: 18, height: 18, borderRadius: 5, backgroundColor: C.line },
  tabDotOn: { backgroundColor: C.brand },
  tabTxt: { fontSize: 11, fontWeight: '600', color: C.mute },
  tabTxtOn: { color: C.brand },
});
