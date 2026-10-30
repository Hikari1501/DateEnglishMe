# Date This Super-Good-At-English Me!
*(Hẹn Hò Với Người Siêu Giỏi Tiếng Anh Như Tớ Đi!)*

An authentic, casual conversational English dating simulator with a soft hand-drawn indie webcomic aesthetic, focused pedagogical objectives, cozy lo-fi BGM, and refined, equal-length distractors.

> [!IMPORTANT]
> **Confirmed Revisions & User Decisions:**
> - **Visual Aesthetic**: Simpler, softer hand-drawn colored sketch and indie webcomic art style (sketchy ink lines, watercolor washes, less polished/airbrushed).
> - **Audio & Voices**: Completely remove character AI TTS voices. Add procedural cozy lo-fi acoustic guitar and warm Rhodes ambient background music tailored to each venue with volume controls.
> - **Refined Options & Equal-Length Distractors**:
>   - Keep response options natural, concise, and roughly equal in length.
>   - Distractor Type 1: Appropriate in meaning, but grammatically incorrect (subtle common ESL errors).
>   - Distractor Type 2: Grammatically flawless, but pragmatically/socially inappropriate or tone-deaf.
> - **Zero In-Game Translations**: English-only immersion for all dialogue, options, and explanations (keeping bilingual English/Vietnamese only on the main title banner).
> - **No IPA**: Remove all IPA phonetic annotations from response choices.
> - **Target Skill Selector**: Let players choose the specific language skill before starting each date (e.g. *Past Simple vs. Present Perfect*, *Food & Taste Vocabulary*, *Literal Meaning vs. Pragmatic Inferences*, *Polite Suggestions & Indirect Requests*).
> - **Authentic Spoken English**: Natural, relaxed, casual spoken English without robotic stiffness or unnecessary formal jargon.

---

## 1. Overview & Core Concept

- **What It Does**: Students embark on a conversational date with an anime partner at a chosen destination. Before starting, the student selects a focused English skill to practice.
- **Pedagogical Shift**: Instead of testing general knowledge all at once, each date concentrates on **one specific language competency**:
  1. **Past Simple vs. Present Perfect** (Recent actions with *just/already*, finished time markers with *ago/yesterday*, life experiences with *have you ever*).
  2. **Food, Taste & Health Vocabulary** (Describing flavors, textures like *savory/crispy/tender/bland*, handling dietary preferences and polite orders).
  3. **Literal Meaning vs. Pragmatic Inferences** (Decoding indirect social cues: e.g. "Is it chilly in here?" = please close the window; "I might have plans" = polite soft 'no').
  4. **Polite Suggestions & Indirect Invitations** (Using *Why don't we*, *How about*, *Would you mind*, and natural social invitations).
- **Distractor Architecture**:
  - Each decision point features 3 balanced options of comparable character length:
    - **Option A (Target/Optimal)**: Natural spoken English, grammatically correct, and socially warm.
    - **Option B (Grammar Distractor)**: Appropriate meaning and tone, but containing an authentic ESL grammar trap (e.g. tense backshift error, wrong preposition, count/non-count mistake).
    - **Option C (Pragmatic Distractor)**: Flawless grammar, but socially blunt, overly literal, or tactless in context.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Title & Setup Screen**:
   - Title Banner: *Date This Super-Good-At-English Me! · Hẹn Hò Với Người Siêu Giỏi Tiếng Anh Như Tớ Đi!*
   - Step 1: Pick a Date Partner (Hana, Kenji, Aoi, Ren) with simple, charming webcomic character illustrations.
   - Step 2: Pick a Destination (Sakura Cafe, Aquarium, Theme Park, Rooftop Terrace).
   - Step 3: Choose Target English Skill (Past Simple vs Present Perfect, Food & Taste, Pragmatic Inferences, Polite Suggestions).
   - Audio controller: Lo-fi music toggle with soothing Rhodes/guitar accompaniment.
2. **Interactive Date View**:
   - Scenic background rendered in soft indie webcomic colored pencil & watercolor wash style.
   - Expressive 2D webcomic character portrait reacting with genuine emotion icons.
   - Clean dialogue box displaying authentic, colloquial speech.
   - Concise 3-option response card deck with equal text lengths and no IPA or translation clutter.
   - Dynamic satisfaction heart meter responding to student choices.
   - Immediate feedback callout explaining the linguistic rule and why the distractor missed the mark.
3. **Report Card & Study Summary**:
   - Final date outcome and letter grade ($S, A, B, C, D$).
   - Focused skill breakdown highlighting the student's mastery of the selected target language point.
   - Review of all choices with clear grammatical/pragmatic analysis.

### Visual Identity & Theme
- **Aesthetic Direction**: Indie webcomic / sketchbook art style. Soft pencil lineart, gentle pastel watercolor washes, warm paper texture, and clean typography.
- **Color Palette**:
  - Background: Muted warm sketchbook cream (`#FDFBF7`) and soft slate.
  - Accents: Warm rose coral (`#E11D48`), sage leaf green (`#059669`), dusty indigo (`#4338CA`), soft amber (`#D97706`).
- **Typography**:
  - Headlines: `Outfit` (approachable, contemporary)
  - Spoken Prose: `Plus Jakarta Sans` (clear, human line-height)

---

## 3. Audio & Music Architecture

- **Removal**: No speech synthesis (TTS) voice lines for character dialogue, ensuring no unnatural robotic voices.
- **Procedural Lo-Fi BGM Engine**:
  - Built with Web Audio API (sine/triangle oscillators with lowpass filtering and soft chorus).
  - Melodic loops:
    - *Sakura Cafe*: Warm Rhodes chord progression (maj7 chords, slow 72 BPM chill beat).
    - *Aquarium*: Dreamy acoustic guitar arpeggios with gentle sub-bass.
    - *Theme Park*: Upbeat acoustic strum with warm synth plucks (85 BPM).
    - *Rooftop Terrace*: Smooth evening lo-fi jazz chords with soft Rhodes voicings.
  - Sound effects: Soft page turn, gentle chime for positive satisfaction, soft thud for blunders.

---

## 4. Technical Architecture & Plan Execution

```
┌────────────────────────────────────────────────────────┐
│                   App State Engine                     │
│  - Target Skill Selected (A / B / C / D)               │
│  - Partner & Destination Selected                      │
│  - Lo-Fi Music Controller (Play / Pause / Volume)      │
│  - Satisfaction Score (0 - 100)                        │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────────┐   ┌──────────────────────────┐
│   Webcomic Art Assets     │   │   Lo-Fi BGM Generator    │
│  - Hand-drawn sketches    │   │  - Rhodes / Guitar loops │
│  - Soft watercolor washes │   │  - Ambient sound effects │
│  - Reactive emotion icons │   └──────────────────────────┘
└───────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│              Target-Skill Scenario Engine                │
│  - Focused dialogue tree based on user-picked skill      │
│  - Balanced-length options (Optimal / Grammar / Pragmatic)│
│  - Authentic, natural conversational English             │
│  - Zero in-game translations or IPA clutter              │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Implementation Steps (Upon Approval)

1. **Art Asset Refresh**: Generate indie webcomic / soft colored sketch art for the 4 characters and 4 backdrops using `generate_image` in parallel.
2. **Lo-Fi Web Audio Engine**: Implement a cozy Rhodes & acoustic guitar chord looper with toggle and volume slider.
3. **Target Skill Scenarios**: Construct focused dialogue modules (Past Simple vs Present Perfect, Food & Taste, Pragmatic Inferences, Polite Suggestions) with equal-length options and dual distractor types (grammatical error vs pragmatic blunder).
4. **UI Streamlining**: Remove character TTS, remove IPA text, remove in-game Vietnamese translations, and update the character/venue/skill setup interface.
5. **Report Card**: Tune evaluation to reflect performance on the chosen language skill with clear takeaway notes.
