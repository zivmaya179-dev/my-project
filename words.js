// ===================================================================
// רשימת המילים של לני - 4 יחידות
// ===================================================================
// כדי להוסיף/לשנות מילים, פשוט ערוך/י את הרשימה הזו.
// פורמט: { en: "מילה באנגלית", he: "תרגום לעברית", example: "משפט לדוגמה (אופציונלי)" }
// אפשר גם להוסיף "unit" כדי לקבץ לפי יחידות לימוד.
// ===================================================================

const WORDS = [
  { en: "achieve", he: "להשיג, להגשים", example: "She worked hard to achieve her goals.", unit: "Unit 1" },
  { en: "ancient", he: "עתיק, קדום", example: "We visited ancient ruins in Greece.", unit: "Unit 1" },
  { en: "behavior", he: "התנהגות", example: "His behavior in class has improved.", unit: "Unit 1" },
  { en: "challenge", he: "אתגר", example: "Learning a new language is a challenge.", unit: "Unit 1" },
  { en: "common", he: "נפוץ, שכיח", example: "It's common to feel nervous before exams.", unit: "Unit 1" },
  { en: "consider", he: "לשקול, להתחשב", example: "Please consider my offer carefully.", unit: "Unit 1" },
  { en: "decision", he: "החלטה", example: "It was a difficult decision to make.", unit: "Unit 1" },
  { en: "describe", he: "לתאר", example: "Can you describe the man you saw?", unit: "Unit 1" },
  { en: "effective", he: "יעיל", example: "This is an effective way to study.", unit: "Unit 1" },
  { en: "environment", he: "סביבה", example: "We must protect the environment.", unit: "Unit 1" },

  { en: "equal", he: "שווה", example: "All people should have equal rights.", unit: "Unit 2" },
  { en: "experience", he: "חוויה, ניסיון", example: "Travel gives you new experiences.", unit: "Unit 2" },
  { en: "familiar", he: "מוכר", example: "Her face looks familiar to me.", unit: "Unit 2" },
  { en: "generation", he: "דור", example: "My generation grew up with smartphones.", unit: "Unit 2" },
  { en: "ignore", he: "להתעלם", example: "Don't ignore the warning signs.", unit: "Unit 2" },
  { en: "improve", he: "לשפר", example: "I want to improve my English.", unit: "Unit 2" },
  { en: "influence", he: "השפעה, להשפיע", example: "Parents have a big influence on children.", unit: "Unit 2" },
  { en: "knowledge", he: "ידע", example: "Knowledge is power.", unit: "Unit 2" },
  { en: "opportunity", he: "הזדמנות", example: "This is a great opportunity for you.", unit: "Unit 2" },
  { en: "prevent", he: "למנוע", example: "Exercise can prevent many diseases.", unit: "Unit 2" },

  { en: "realize", he: "להבין, להפנים", example: "I didn't realize how late it was.", unit: "Unit 3" },
  { en: "recognize", he: "לזהות, להכיר", example: "I didn't recognize you with your new haircut!", unit: "Unit 3" },
  { en: "recently", he: "לאחרונה", example: "I recently moved to a new city.", unit: "Unit 3" },
  { en: "require", he: "לדרוש, להצריך", example: "This job requires hard work.", unit: "Unit 3" },
  { en: "significant", he: "משמעותי, חשוב", example: "There has been a significant change.", unit: "Unit 3" },
  { en: "society", he: "חברה (כלל האנשים)", example: "Technology has changed our society.", unit: "Unit 3" },
  { en: "succeed", he: "להצליח", example: "If you try hard, you will succeed.", unit: "Unit 3" },
  { en: "support", he: "לתמוך, תמיכה", example: "My family always supports me.", unit: "Unit 3" },
  { en: "treat", he: "לטפל, להתייחס", example: "Always treat others with respect.", unit: "Unit 3" },
  { en: "various", he: "שונים, מגוונים", example: "The store sells various kinds of fruit.", unit: "Unit 3" },

  { en: "accept", he: "לקבל, להסכים", example: "Please accept my apology.", unit: "Unit 4" },
  { en: "advantage", he: "יתרון", example: "Knowing English is a big advantage.", unit: "Unit 4" },
  { en: "advice", he: "עצה", example: "Can you give me some advice?", unit: "Unit 4" },
  { en: "afford", he: "להרשות לעצמו", example: "I can't afford a new car.", unit: "Unit 4" },
  { en: "appear", he: "להופיע, להיראות", example: "Stars appear in the sky at night.", unit: "Unit 4" },
  { en: "argue", he: "להתווכח", example: "They always argue about politics.", unit: "Unit 4" },
  { en: "available", he: "זמין", example: "Are you available tomorrow?", unit: "Unit 4" },
  { en: "avoid", he: "להימנע", example: "Try to avoid junk food.", unit: "Unit 4" },
  { en: "believe", he: "להאמין", example: "I believe in you!", unit: "Unit 4" },
  { en: "benefit", he: "תועלת, הטבה", example: "Exercise has many benefits.", unit: "Unit 4" },

  { en: "complain", he: "להתלונן", example: "She always complains about the weather.", unit: "Unit 5" },
  { en: "confident", he: "בטוח בעצמו", example: "She is confident she will pass the exam.", unit: "Unit 5" },
  { en: "confuse", he: "לבלבל", example: "The instructions confused me.", unit: "Unit 5" },
  { en: "convince", he: "לשכנע", example: "He convinced me to come with him.", unit: "Unit 5" },
  { en: "courage", he: "אומץ", example: "It takes courage to speak up.", unit: "Unit 5" },
  { en: "damage", he: "נזק, לפגוע", example: "The storm caused a lot of damage.", unit: "Unit 5" },
  { en: "danger", he: "סכנה", example: "Smoking is a danger to your health.", unit: "Unit 5" },
  { en: "depend", he: "להיות תלוי", example: "It depends on the weather.", unit: "Unit 5" },
  { en: "discover", he: "לגלות", example: "Scientists discovered a new planet.", unit: "Unit 5" },
  { en: "encourage", he: "לעודד", example: "My teacher encouraged me to try again.", unit: "Unit 5" }
];
