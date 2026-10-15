// Example circle, so the app opens in a realistic state before a backend exists.
// Coordinates are around central Tel Aviv.
export const CIRCLE_NAME = 'המשפחה';

export const MEMBERS = [
  {
    id: 'noa',
    name: 'נועה',
    color: '#8A5BD6',
    status: 'בדרך הביתה',
    battery: 74,
    role: 'full',
    coord: { latitude: 32.0795, longitude: 34.7745 },
  },
  {
    id: 'yael',
    name: 'יעל',
    color: '#C2763C',
    status: 'בחוג התעמלות',
    battery: 31,
    role: 'full',
    coord: { latitude: 32.0861, longitude: 34.7912 },
  },
  {
    id: 'ima',
    name: 'אמא',
    color: '#2F6F68',
    status: 'בעבודה',
    battery: 52,
    role: 'admin',
    coord: { latitude: 32.0723, longitude: 34.7804 },
  },
  {
    id: 'aba',
    name: 'אבא',
    color: '#3F6AB2',
    status: 'בבית',
    battery: 88,
    role: 'full',
    coord: { latitude: 32.0908, longitude: 34.7731 },
  },
  {
    id: 'shchena',
    name: 'רונית, שכנה',
    color: '#8A8A8A',
    status: 'רק במצוקה',
    battery: null,
    role: 'sos_only',
    coord: null,
  },
];

export const TODAY = [
  { id: 1, part: 'אחר הצהריים', who: 'yael', what: 'יצאה מבית הספר', time: '14:10', arrived: false },
  { id: 2, part: 'אחר הצהריים', who: 'yael', what: 'הגיעה לחוג התעמלות', time: '14:38', arrived: true },
  { id: 3, part: 'אחר הצהריים', who: 'noa', what: 'בדרך הביתה, שמונה דקות', time: 'עכשיו', arrived: false },
  { id: 4, part: 'בוקר', who: 'noa', what: 'יצאה מהבית', time: '07:31', arrived: false },
  { id: 5, part: 'בוקר', who: 'noa', what: 'הגיעה לבית הספר', time: '07:52', arrived: true },
];

export const TEL_AVIV = {
  latitude: 32.0814,
  longitude: 34.7818,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export const byId = (id) => MEMBERS.find((m) => m.id === id);
