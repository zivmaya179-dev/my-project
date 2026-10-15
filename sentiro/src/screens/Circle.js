import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Circle as MapCircle } from 'react-native-maps';
import * as Location from 'expo-location';
import { C, S, T } from '../theme';
import { MEMBERS, TEL_AVIV } from '../data';

// Real map. On iOS this is Apple Maps with no key; on Android, Google Maps.
// Expo Go needs no key of our own for either one.
export default function CircleScreen() {
  const map = useRef(null);
  const [me, setMe] = useState(null);
  const [permission, setPermission] = useState('pending');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermission(status);
        if (status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setMe({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      } catch {
        setPermission('error');
      }
    })();
  }, []);

  function goToMe() {
    if (!me || !map.current) return;
    map.current.animateToRegion(
      { ...me, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      450
    );
  }

  const onMap = MEMBERS.filter((m) => m.coord);

  return (
    <View style={styles.wrap}>
      <View style={styles.mapBox}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={TEL_AVIV}
        showsUserLocation={permission === 'granted'}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {/* The two saved places. Arrival and departure alerts fire on these. */}
        <MapCircle
          center={{ latitude: 32.0908, longitude: 34.7731 }}
          radius={140}
          strokeColor="rgba(47,111,104,0.55)"
          fillColor="rgba(47,111,104,0.14)"
          strokeWidth={2}
        />
        <MapCircle
          center={{ latitude: 32.0861, longitude: 34.7912 }}
          radius={140}
          strokeColor="rgba(47,111,104,0.55)"
          fillColor="rgba(47,111,104,0.14)"
          strokeWidth={2}
        />

        {onMap.map((m) => (
          <Marker
            key={m.id}
            coordinate={m.coord}
            title={m.name}
            description={m.status}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.pinWrap}>
              <View style={[styles.pin, { backgroundColor: m.color }]}>
                <Text style={styles.pinTxt}>{m.name.charAt(0)}</Text>
              </View>
              <View style={styles.pinTail} />
            </View>
          </Marker>
        ))}
      </MapView>

      {permission === 'denied' && (
        <View style={styles.banner}>
          <Text style={styles.bannerTxt}>
            בלי הרשאת מיקום אפשר לראות את המעגל, אבל לא את עצמך.
          </Text>
        </View>
      )}

      <Pressable style={styles.locBtn} onPress={goToMe} accessibilityLabel="מרכזי עליי">
        <Text style={styles.locTxt}>◎</Text>
      </Pressable>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <ScrollView style={{ maxHeight: 210 }} showsVerticalScrollIndicator={false}>
          {MEMBERS.map((m, i) => (
            <View key={m.id} style={[styles.row, i > 0 && styles.rowLine]}>
              <View style={[styles.av, { backgroundColor: m.color }]}>
                <Text style={styles.avTxt}>{m.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={T.h2} numberOfLines={1}>
                  {m.name}
                </Text>
                <Text style={T.small} numberOfLines={1}>
                  {m.status}
                </Text>
              </View>
              {m.battery != null ? (
                <View>
                  <Text style={styles.batLabel}>סוללה</Text>
                  <Text
                    style={[
                      styles.bat,
                      { color: m.battery <= 35 ? C.danger : C.safe },
                    ]}
                  >
                    {m.battery}%
                  </Text>
                </View>
              ) : (
                <Text style={styles.sosOnly}>SOS בלבד</Text>
              )}
            </View>
          ))}
        </ScrollView>
        <Text style={styles.footNote}>
          המיקום מתעדכן כשמישהו מגיע או יוצא ממקום שהגדרתם. מפה חיה רציפה נפתחת רק בליווי בדרך
          ובמצוקה.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  mapBox: { flex: 1, position: 'relative' },
  pinWrap: { alignItems: 'center' },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinTxt: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    marginTop: -1,
  },
  banner: {
    position: 'absolute',
    top: 10,
    left: S.gutter,
    right: S.gutter,
    backgroundColor: C.surface,
    borderRadius: S.radius,
    padding: 10,
    borderWidth: 1,
    borderColor: C.line,
  },
  bannerTxt: { ...T.small, textAlign: 'center' },
  locBtn: {
    position: 'absolute',
    bottom: 14,
    left: S.gutter,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.line,
  },
  locTxt: { fontSize: 20, color: C.brand },
  sheet: {
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.line,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: S.gutter,
    paddingTop: 8,
    paddingBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: -6 } },
      android: { elevation: 12 },
    }),
  },
  grabber: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.line,
    marginBottom: 6,
  },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 9 },
  rowLine: { borderTopWidth: 1, borderTopColor: C.line },
  av: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  batLabel: { ...T.tiny, textAlign: 'left' },
  bat: { fontSize: 13, fontWeight: '700', textAlign: 'left' },
  sosOnly: { ...T.tiny, color: C.mute },
  footNote: { ...T.tiny, lineHeight: 16, marginTop: 8 },
});
