import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { buildRoutineRecommendation } from "./src/domain/recommendations";
import { calculateSkinProfile } from "./src/domain/scoring";
import { initialSurveyAnswers, surveyQuestions } from "./src/domain/survey";
import type { BooleanPreference, RoutineRecommendation, SurveyAnswers } from "./src/domain/types";
import { getProducts } from "./src/data/productRepository";

type Screen = "intro" | "survey" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(initialSurveyAnswers);
  const [result, setResult] = useState<RoutineRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = surveyQuestions[stepIndex];
  const progress = Math.round(((stepIndex + 1) / surveyQuestions.length) * 100);

  const canGoBack = screen === "survey" && stepIndex > 0;

  async function finishSurvey() {
    setIsLoading(true);
    const products = await getProducts();
    const profile = calculateSkinProfile(answers);
    setResult(buildRoutineRecommendation(profile, products));
    setIsLoading(false);
    setScreen("result");
  }

  async function goNext() {
    if (stepIndex < surveyQuestions.length - 1) {
      setStepIndex((value) => value + 1);
      return;
    }

    await finishSurvey();
  }

  function goBack() {
    if (canGoBack) setStepIndex((value) => value - 1);
  }

  function restart() {
    setAnswers(initialSurveyAnswers);
    setResult(null);
    setStepIndex(0);
    setScreen("intro");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {screen === "intro" ? (
        <IntroScreen onStart={() => setScreen("survey")} />
      ) : screen === "survey" && currentQuestion ? (
        <SurveyScreen
          answers={answers}
          canGoBack={canGoBack}
          isLoading={isLoading}
          onAnswersChange={setAnswers}
          onBack={goBack}
          onNext={goNext}
          progress={progress}
          question={currentQuestion}
          stepIndex={stepIndex}
          totalSteps={surveyQuestions.length}
        />
      ) : (
        <ResultScreen onRestart={restart} recommendation={result} />
      )}
    </SafeAreaView>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.intro}>
      <View>
        <Text style={styles.eyebrow}>CeraMatch AI</Text>
        <Text style={styles.heroTitle}>Rutyna dobrana do Twojej skóry</Text>
        <Text style={styles.heroText}>
          Ankieta tworzy profil skóry, a algorytm dobiera kosmetyki z kuratorowanej bazy produktów.
        </Text>
      </View>
      <View style={styles.visualCard}>
        <Text style={styles.visualNumber}>129</Text>
        <Text style={styles.visualLabel}>produktów w seedzie bazy</Text>
      </View>
      <PrimaryButton label="Rozpocznij ankietę" onPress={onStart} />
    </View>
  );
}

type SurveyScreenProps = {
  answers: SurveyAnswers;
  canGoBack: boolean;
  isLoading: boolean;
  onAnswersChange: (answers: SurveyAnswers) => void;
  onBack: () => void;
  onNext: () => void;
  progress: number;
  question: (typeof surveyQuestions)[number];
  stepIndex: number;
  totalSteps: number;
};

function SurveyScreen({
  answers,
  canGoBack,
  isLoading,
  onAnswersChange,
  onBack,
  onNext,
  progress,
  question,
  stepIndex,
  totalSteps,
}: SurveyScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable disabled={!canGoBack} onPress={onBack} style={[styles.backButton, !canGoBack && styles.disabled]}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={styles.progressWrap}>
          <View style={styles.progressLabel}>
            <Text style={styles.progressText}>
              Krok {stepIndex + 1} z {totalSteps}
            </Text>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.questionContent}>
        <Text style={styles.questionTitle}>{question.title}</Text>
        <Text style={styles.questionDescription}>{question.description}</Text>
        <QuestionInput question={question} answers={answers} onAnswersChange={onAnswersChange} />
      </ScrollView>

      <PrimaryButton label={isLoading ? "Liczenie..." : stepIndex === totalSteps - 1 ? "Pokaż plan" : "Dalej"} onPress={onNext} />
    </View>
  );
}

type QuestionInputProps = {
  question: (typeof surveyQuestions)[number];
  answers: SurveyAnswers;
  onAnswersChange: (answers: SurveyAnswers) => void;
};

function QuestionInput({ question, answers, onAnswersChange }: QuestionInputProps) {
  if (question.type === "single") {
    const selected = answers[question.id] as string | undefined;
    return (
      <View style={styles.optionList}>
        {question.options.map((option) => (
          <OptionButton
            key={option.value}
            description={option.description}
            isSelected={selected === option.value}
            label={option.label}
            onPress={() => onAnswersChange({ ...answers, [question.id]: option.value })}
          />
        ))}
      </View>
    );
  }

  if (question.type === "multi") {
    const selected = new Set((answers[question.id] as string[]) ?? []);
    return (
      <View style={styles.optionList}>
        {question.options.map((option) => {
          const nextValues = new Set(selected);
          const isSelected = nextValues.has(option.value);
          return (
            <OptionButton
              key={option.value}
              description={option.description}
              isSelected={isSelected}
              label={option.label}
              onPress={() => {
                if (isSelected) nextValues.delete(option.value);
                else nextValues.add(option.value);
                onAnswersChange({ ...answers, [question.id]: Array.from(nextValues) });
              }}
            />
          );
        })}
      </View>
    );
  }

  if (question.type === "preferences") {
    return (
      <View style={styles.optionList}>
        <PreferenceRow
          label="Preferuję produkty bezzapachowe"
          value={answers.preferences.fragranceFree}
          onChange={(value) => onAnswersChange({ ...answers, preferences: { ...answers.preferences, fragranceFree: value } })}
        />
        <PreferenceRow
          label="Potrzebuję produktów bezpieczniejszych w ciąży"
          value={answers.preferences.pregnancySafe}
          onChange={(value) => onAnswersChange({ ...answers, preferences: { ...answers.preferences, pregnancySafe: value } })}
        />
        <PreferenceRow
          label="Wolę lekkie wykończenie"
          value={answers.preferences.lightFinish}
          onChange={(value) => onAnswersChange({ ...answers, preferences: { ...answers.preferences, lightFinish: value } })}
        />
      </View>
    );
  }

  return (
    <TextInput
      multiline
      onChangeText={(notes) => onAnswersChange({ ...answers, notes })}
      placeholder={"placeholder" in question ? question.placeholder : ""}
      style={styles.textArea}
      value={answers.notes}
    />
  );
}

function PreferenceRow({
  label,
  onChange,
  value = "unknown",
}: {
  label: string;
  onChange: (value: BooleanPreference) => void;
  value?: BooleanPreference;
}) {
  return (
    <View style={styles.preferenceRow}>
      <Text style={styles.preferenceLabel}>{label}</Text>
      <View style={styles.segment}>
        {(["yes", "no", "unknown"] as const).map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.segmentButton, value === option && styles.segmentButtonActive]}
          >
            <Text style={[styles.segmentText, value === option && styles.segmentTextActive]}>
              {option === "yes" ? "Tak" : option === "no" ? "Nie" : "Nie wiem"}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ResultScreen({
  onRestart,
  recommendation,
}: {
  onRestart: () => void;
  recommendation: RoutineRecommendation | null;
}) {
  const blocks = useMemo(() => [...(recommendation?.morning ?? []), ...(recommendation?.evening ?? [])], [recommendation]);

  if (!recommendation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.resultContent}>
      <Text style={styles.eyebrow}>Twój plan</Text>
      <Text style={styles.resultTitle}>Priorytet: {translatePriority(recommendation.profile.priority)}</Text>
      <Text style={styles.resultText}>
        Typ skóry: {translateSkinType(recommendation.profile.skinType)}. Produkty są wybierane z bazy i sortowane według
        dopasowania, bezpieczeństwa oraz budżetu.
      </Text>

      {recommendation.warnings.map((warning) => (
        <View key={warning} style={styles.notice}>
          <Text style={styles.noticeText}>{warning}</Text>
        </View>
      ))}

      {blocks.map((block) => (
        <View key={block.step} style={styles.routineBlock}>
          <Text style={styles.blockTitle}>{block.title}</Text>
          <Text style={styles.blockInstruction}>{block.instruction}</Text>
          {block.candidates.map((candidate) => (
            <View key={candidate.product.id} style={styles.productCard}>
              <Text style={styles.productBrand}>{candidate.product.brand}</Text>
              <Text style={styles.productName}>{candidate.product.productName}</Text>
              <Text style={styles.productReason}>{candidate.product.shortReason ?? candidate.reasons.join(", ")}</Text>
              <Text style={styles.productMeta}>
                {candidate.product.pricePln ? `${candidate.product.pricePln.toFixed(2)} zł` : "Cena do uzupełnienia"} · score{" "}
                {candidate.score}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <PrimaryButton label="Wypełnij ponownie" onPress={onRestart} />
    </ScrollView>
  );
}

function OptionButton({
  description,
  isSelected,
  label,
  onPress,
}: {
  description?: string;
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.option, isSelected && styles.optionSelected]}>
      <Text style={styles.optionLabel}>{label}</Text>
      {description ? <Text style={styles.optionDescription}>{description}</Text> : null}
    </Pressable>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function translatePriority(priority: RoutineRecommendation["profile"]["priority"]): string {
  const labels = {
    maintenance: "utrzymanie stabilności",
    barrier: "odbudowa bariery",
    redness: "wyciszenie rumienia",
    acne: "kontrola wyprysków",
    comedones: "zaskórniki",
    pigmentation: "wyrównanie kolorytu",
    dehydration: "nawilżenie",
    aging: "anti-aging",
    texture: "wygładzenie tekstury",
    firmness: "jędrność",
    dullness: "rozświetlenie",
    dryness: "suchość",
    irritation: "podrażnienia",
  } satisfies Record<RoutineRecommendation["profile"]["priority"], string>;
  return labels[priority];
}

function translateSkinType(skinType: RoutineRecommendation["profile"]["skinType"]): string {
  const labels = {
    dry: "sucha/odwodniona",
    balanced: "zrównoważona",
    combination: "mieszana",
    oily: "tłusta",
  };
  return labels[skinType];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7faf7",
  },
  intro: {
    flex: 1,
    gap: 28,
    justifyContent: "space-between",
    padding: 22,
  },
  eyebrow: {
    color: "#3e604e",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#17201d",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
  },
  heroText: {
    color: "#63716b",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 18,
  },
  visualCard: {
    backgroundColor: "#dceadf",
    borderRadius: 10,
    padding: 22,
  },
  visualNumber: {
    color: "#3e604e",
    fontSize: 64,
    fontWeight: "900",
  },
  visualLabel: {
    color: "#3e604e",
    fontSize: 15,
    fontWeight: "800",
  },
  screen: {
    flex: 1,
    padding: 18,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#dce4df",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  backButtonText: {
    color: "#3e604e",
    fontSize: 24,
    fontWeight: "900",
  },
  disabled: {
    opacity: 0.35,
  },
  progressWrap: {
    flex: 1,
  },
  progressLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    color: "#63716b",
    fontSize: 12,
    fontWeight: "800",
  },
  progressTrack: {
    backgroundColor: "#e2e9e5",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressBar: {
    backgroundColor: "#5d7f68",
    borderRadius: 999,
    height: 8,
  },
  questionContent: {
    gap: 16,
    paddingBottom: 24,
    paddingTop: 28,
  },
  questionTitle: {
    color: "#17201d",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 32,
  },
  questionDescription: {
    color: "#63716b",
    fontSize: 15,
    lineHeight: 22,
  },
  optionList: {
    gap: 10,
  },
  option: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4df",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  optionSelected: {
    backgroundColor: "#eef6f1",
    borderColor: "#5d7f68",
  },
  optionLabel: {
    color: "#17201d",
    fontSize: 16,
    fontWeight: "800",
  },
  optionDescription: {
    color: "#63716b",
    fontSize: 13,
    lineHeight: 18,
  },
  preferenceRow: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4df",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  preferenceLabel: {
    color: "#17201d",
    fontSize: 15,
    fontWeight: "800",
  },
  segment: {
    backgroundColor: "#eef2ef",
    borderRadius: 8,
    flexDirection: "row",
    padding: 4,
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    minHeight: 36,
    justifyContent: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#3e604e",
  },
  segmentText: {
    color: "#63716b",
    fontSize: 12,
    fontWeight: "800",
  },
  segmentTextActive: {
    color: "#ffffff",
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4df",
    borderRadius: 8,
    borderWidth: 1,
    color: "#17201d",
    minHeight: 140,
    padding: 14,
    textAlignVertical: "top",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#3e604e",
    borderRadius: 8,
    minHeight: 54,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  resultContent: {
    gap: 14,
    padding: 18,
    paddingBottom: 36,
  },
  resultTitle: {
    color: "#17201d",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34,
  },
  resultText: {
    color: "#63716b",
    fontSize: 15,
    lineHeight: 22,
  },
  notice: {
    backgroundColor: "#fff8ea",
    borderLeftColor: "#bc8a35",
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
  },
  noticeText: {
    color: "#725018",
    lineHeight: 20,
  },
  routineBlock: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4df",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  blockTitle: {
    color: "#17201d",
    fontSize: 20,
    fontWeight: "900",
  },
  blockInstruction: {
    color: "#63716b",
    fontSize: 14,
    lineHeight: 20,
  },
  productCard: {
    backgroundColor: "#f8faf8",
    borderRadius: 8,
    gap: 4,
    padding: 12,
  },
  productBrand: {
    color: "#3c7d87",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  productName: {
    color: "#17201d",
    fontSize: 15,
    fontWeight: "800",
  },
  productReason: {
    color: "#63716b",
    fontSize: 13,
    lineHeight: 18,
  },
  productMeta: {
    color: "#3e604e",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
});
