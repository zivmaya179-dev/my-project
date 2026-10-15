import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { C } from '../theme';

export const HOLD_MS = 2000;

// Hold for two seconds. No extra countdown: the siren is meant to be immediate.
export default function HoldButton({ size = 56, label = 'SOS', onFire, disabled }) {
  const progress = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  const buzz = useRef(null);
  const [holding, setHolding] = useState(false);

  useEffect(() => () => stop(), []);

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    if (buzz.current) clearInterval(buzz.current);
    timer.current = null;
    buzz.current = null;
  }

  function begin() {
    if (disabled) return;
    setHolding(true);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    buzz.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }, 600);
    timer.current = setTimeout(() => {
      stop();
      setHolding(false);
      progress.setValue(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      onFire();
    }, HOLD_MS);
  }

  function cancel() {
    stop();
    setHolding(false);
    Animated.timing(progress, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  }

  const ringWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Pressable
      onPressIn={begin}
      onPressOut={cancel}
      accessibilityRole="button"
      accessibilityLabel="לחצן מצוקה, החזיקי שתי שניות"
      style={[
        styles.btn,
        { width: size, height: size, borderRadius: size / 2 },
        holding && styles.btnHolding,
      ]}
    >
      <Text style={[styles.label, { fontSize: size > 100 ? 30 : 13 }]}>{label}</Text>
      <View style={[styles.track, { borderRadius: size / 2 }]} pointerEvents="none">
        <Animated.View style={[styles.fill, { width: ringWidth }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: C.danger,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  btnHolding: { backgroundColor: '#9E1F12' },
  label: { color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.5 },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  fill: { position: 'absolute', right: 0, top: 0, bottom: 0, backgroundColor: '#FFFFFF' },
});
