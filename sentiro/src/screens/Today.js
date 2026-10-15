import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, S, T } from '../theme';
import { TODAY, byId } from '../data';

// The home screen. The everyday question is "did she get there", not "where is she now".
export default function TodayScreen() {
  const parts = [];
  TODAY.forEach((e) => {
    const last = parts[parts.length - 1];
    if (!last || last.title !== e.part) parts.push({ title: e.part, items: [e] });
    else last.items.push(e);
  });

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {parts.map((p) => (
        <View key={p.title}>
          <Text style={styles.part}>{p.title}</Text>
          <View style={styles.card}>
            {p.items.map((e, i) => {
              const m = byId(e.who);
              return (
                <View key={e.id} style={[styles.row, i > 0 && styles.rowLine]}>
                  <View style={[styles.av, { backgroundColor: m.color }]}>
                    <Text style={styles.avTxt}>{m.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={T.h2}>{m.name}</Text>
                    <Text style={T.small}>{e.what}</Text>
                  </View>
                  {e.arrived && (
                    <View style={styles.tick}>
                      <Text style={styles.tickTxt}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.time}>{e.time}</Text>
                </View>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.drill}>
        <Text style={styles.drillH}>בדיקת מערכת: יום שלישי, 9:00</Text>
        <Text style={T.small}>
          תרגול שקט שמוודא שהתראת מצוקה מגיעה לכל המכשירים במעגל. בלי צופר ובלי להבהיל אף אחד.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: S.gutter, paddingBottom: 8, gap: 6 },
  part: { ...T.tiny, fontWeight: '700', letterSpacing: 0.6, marginBottom: 6, marginTop: 8 },
  card: {
    backgroundColor: C.surface,
    borderRadius: S.radiusLg,
    borderWidth: 1,
    borderColor: C.line,
    paddingHorizontal: 12,
  },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 11 },
  rowLine: { borderTopWidth: 1, borderTopColor: C.line },
  av: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  tick: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.safe,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickTxt: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  time: { ...T.tiny, textAlign: 'left', minWidth: 42 },
  drill: {
    marginTop: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.line,
    borderRadius: S.radius,
    padding: 12,
    gap: 4,
  },
  drillH: { ...T.body, fontWeight: '700', fontSize: 14 },
});
