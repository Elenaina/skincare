import type { SurveyAnswers } from "./types";

export type SurveyOption = {
  value: string;
  label: string;
  description?: string;
};

export type SurveyQuestion =
  | {
      id: keyof SurveyAnswers;
      title: string;
      description: string;
      type: "single" | "multi";
      options: SurveyOption[];
    }
  | {
      id: "preferences";
      title: string;
      description: string;
      type: "preferences";
    }
  | {
      id: "notes";
      title: string;
      description: string;
      type: "textarea";
      placeholder: string;
    };

export const initialSurveyAnswers: SurveyAnswers = {
  concerns: [],
  currentRoutine: [],
  barrierSignals: [],
  lifestyle: [],
  preferences: {
    fragranceFree: "unknown",
    pregnancySafe: "unknown",
    lightFinish: "unknown",
  },
};

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "skinFeel",
    title: "Jak skóra zachowuje się 2-3 godziny po umyciu?",
    description: "To ustawia bazowy typ cery.",
    type: "single",
    options: [
      { value: "tight", label: "Ściąga się", description: "Często potrzebuje bogatszego kremu." },
      { value: "comfortable", label: "Jest komfortowa", description: "Nie świeci się mocno i nie jest napięta." },
      { value: "tZoneShine", label: "Świeci się w strefie T", description: "Policzki bywają normalne lub suche." },
      { value: "allOverShine", label: "Przetłuszcza się cała", description: "Błyszczenie szybko wraca na większości twarzy." },
    ],
  },
  {
    id: "concerns",
    title: "Co najbardziej chcesz poprawić?",
    description: "Wybierz wszystkie istotne problemy skóry.",
    type: "multi",
    options: [
      { value: "dehydration", label: "Odwodnienie" },
      { value: "barrier", label: "Bariera hydrolipidowa" },
      { value: "acne", label: "Wypryski" },
      { value: "comedones", label: "Zaskórniki" },
      { value: "redness", label: "Rumień i reaktywność" },
      { value: "pigmentation", label: "Przebarwienia" },
      { value: "texture", label: "Nierówna tekstura" },
      { value: "aging", label: "Zmarszczki" },
    ],
  },
  {
    id: "sensitivity",
    title: "Jak często skóra reaguje pieczeniem albo rumieniem?",
    description: "Wpływa to na siłę składników aktywnych.",
    type: "single",
    options: [
      { value: "low", label: "Rzadko" },
      { value: "medium", label: "Czasami" },
      { value: "high", label: "Często" },
    ],
  },
  {
    id: "currentRoutine",
    title: "Co jest już w Twojej pielęgnacji?",
    description: "Pomoże to uniknąć dublowania aktywnych składników.",
    type: "multi",
    options: [
      { value: "cleanser", label: "Oczyszczanie" },
      { value: "cream", label: "Krem" },
      { value: "spf", label: "SPF" },
      { value: "acids", label: "Kwasy" },
      { value: "retinoid", label: "Retinoid" },
      { value: "vitamin_c", label: "Witamina C" },
      { value: "none", label: "Brak stałej rutyny" },
    ],
  },
  {
    id: "barrierSignals",
    title: "Czy widzisz sygnały naruszonej bariery?",
    description: "Przy takich objawach aplikacja ograniczy mocne aktywy.",
    type: "multi",
    options: [
      { value: "burning", label: "Pieczenie po kosmetykach" },
      { value: "flaking", label: "Łuszczenie lub suchość" },
      { value: "overexfoliation", label: "Dużo złuszczania" },
      { value: "dermatological_treatment", label: "Leczenie dermatologiczne" },
      { value: "none", label: "Nie zauważam" },
    ],
  },
  {
    id: "lifestyle",
    title: "Co wpływa na skórę na co dzień?",
    description: "Te odpowiedzi pomagają dobrać praktyczną rutynę.",
    type: "multi",
    options: [
      { value: "makeup", label: "Makijaż lub ciężki SPF" },
      { value: "sport", label: "Częsty sport" },
      { value: "outdoor", label: "Dużo czasu na zewnątrz" },
      { value: "stress", label: "Stres i mało snu" },
      { value: "aircon", label: "Klimatyzacja lub ogrzewanie" },
    ],
  },
  {
    id: "preferences",
    title: "Preferencje produktu",
    description: "Na MVP zapisujemy trzy najważniejsze filtry bezpieczeństwa i komfortu.",
    type: "preferences",
  },
  {
    id: "notes",
    title: "Czy aplikacja powinna czegoś unikać?",
    description: "Np. alergie, konkretne marki, leki, ciąża/karmienie.",
    type: "textarea",
    placeholder: "Wpisz notatki...",
  },
];
