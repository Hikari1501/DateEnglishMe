import { DialogueNode, TargetSkillId } from '../types/game';

export const SCENARIOS_BY_SKILL: Record<TargetSkillId, DialogueNode[]> = {
  // =========================================================================
  // 1. PAST SIMPLE VS. PRESENT PERFECT (Sunny Corner Cafe)
  // =========================================================================
  past_vs_perfect: [
    {
      id: 'pvp_1',
      narrativeLeadIn: "The sun shines warmly into the cafe. The smell of fresh coffee fills the room.",
      partnerSpeech: "Hey! Sorry if you waited long. Traffic was terrible. How was your trip over?",
      initialExpression: 'happy',
      pedagogicalFocus: 'Past Simple with finished past times ("five minutes ago") vs. Present Perfect.',
      options: [
        {
          id: 'opt_1_opt',
          text: "I actually arrived just five minutes ago, so don't stress.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Oh, what a relief! I was worried you'd been sitting here waiting for half an hour.",
          ruleNote: "Use the past simple ('arrived') with specific finished past times like 'five minutes ago'."
        },
        {
          id: 'opt_1_gr',
          text: "I have arrived here five minutes ago, so don't stress.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "Wait, you mean you arrived five minutes ago? Remember 'ago' always pairs with the simple past! But I'm glad you just got here.",
          ruleNote: "Never combine the present perfect ('have arrived') with specific finished time markers like 'ago'."
        },
        {
          id: 'opt_1_pr',
          text: "My commute was completely awful and my feet hurt so badly.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Oh... gosh, I'm sorry. I didn't mean to start our date on such a stressful note.",
          ruleNote: "Avoid greeting your date with intense negativity; offer gentle reassurance instead."
        }
      ]
    },
    {
      id: 'pvp_2',
      narrativeLeadIn: "The waiter brings two hot cups to your table. Soft acoustic music plays.",
      partnerSpeech: "Have you ever tried the seasonal spiced mocha here? People say it's amazing.",
      initialExpression: 'thoughtful',
      pedagogicalFocus: 'Present Perfect for life experience ("haven\'t tried... yet") vs. Past Simple.',
      options: [
        {
          id: 'opt_2_opt',
          text: "I haven't tasted it yet, but it sounds delicious.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Awesome! Let's definitely split one then so we can both see what the hype is about.",
          ruleNote: "Use the present perfect with 'yet' to talk about life experiences that haven't occurred up to the present."
        },
        {
          id: 'opt_2_gr',
          text: "I didn't tasted it yet, but it sounds delicious.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "Haha, you mean you haven't tasted it yet? Or didn't taste it? Watch out for 'didn't' with past participle! But yeah, it smells great.",
          ruleNote: "After 'didn't', use the base verb ('didn't taste'), or use present perfect ('haven't tasted yet')."
        },
        {
          id: 'opt_2_pr',
          text: "I hate seasonal drinks because they are overpriced gimmicks.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Oh... well, I just thought it looked fun. You didn't have to be so cynical about it.",
          ruleNote: "Express food preferences kindly rather than mocking what your date finds exciting."
        }
      ]
    },
    {
      id: 'pvp_3',
      narrativeLeadIn: "A cool breeze blows outside the window. Cherry blossom petals float past.",
      partnerSpeech: "I stayed up late watching an old comedy last night. Did you do anything fun yesterday?",
      initialExpression: 'happy',
      pedagogicalFocus: 'Past Simple with definite time "yesterday" vs. Present Perfect.',
      options: [
        {
          id: 'opt_3_opt',
          text: "I checked out a small independent bookstore downtown.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "No way, an indie bookshop? That sounds right up my alley! Did you pick up anything good?",
          ruleNote: "Use the past simple ('checked out') when answering about finished past times like 'yesterday'."
        },
        {
          id: 'opt_3_gr',
          text: "I have checked out a bookstore yesterday afternoon.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "You checked it out yesterday? Quick tip—since 'yesterday' is a completed time, just say 'I checked out'! But that sounds super cozy.",
          ruleNote: "Finished past time markers like 'yesterday afternoon' require past simple ('I checked out')."
        },
        {
          id: 'opt_3_pr',
          text: "I stayed home because none of my friends care.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'shocked',
          characterReaction: "Whoa... that's heavy. Are you okay? That sounds pretty rough, though a bit intense for coffee talk.",
          ruleNote: "Avoid self-pitying emotional venting during casual conversational banter."
        }
      ]
    },
    {
      id: 'pvp_4',
      narrativeLeadIn: "Your date looks up at a travel photo on the wall with bright, curious eyes.",
      partnerSpeech: "Look at that photo of Hokkaido! I've always wanted to see that snow festival. Have you been there before?",
      initialExpression: 'blushing',
      pedagogicalFocus: 'Past Simple with finished dates vs. Present Perfect for life experience.',
      options: [
        {
          id: 'opt_4_opt',
          text: "I went there two winters ago with my family.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'blushing',
          characterReaction: "Really? You're so lucky! You'll have to tell me all about the giant ice sculptures later.",
          ruleNote: "When you specify when a past trip happened ('two winters ago'), switch from present perfect to past simple."
        },
        {
          id: 'opt_4_gr',
          text: "I have been there two winters ago with family.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "Wait, you've been there? Or you went two winters ago? Remember that 'ago' takes past simple! Still, that sounds breathtaking.",
          ruleNote: "Do not use 'have been' with time markers ending in 'ago'. Say 'I went there two winters ago'."
        },
        {
          id: 'opt_4_pr',
          text: "I went once, but tourist crowds totally ruined it.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Oh... that's kind of a buzzkill. I was hoping you'd have some magical memories to share.",
          ruleNote: "Try not to pop your partner's romantic enthusiasm with immediate cynicism."
        }
      ]
    },
    {
      id: 'pvp_5',
      narrativeLeadIn: "The clock softly ticks. Your date smiles warmly as the afternoon draws to a close.",
      partnerSpeech: "Today honestly flew by so fast. To be honest, I haven't felt this relaxed in a while.",
      initialExpression: 'blushing',
      pedagogicalFocus: 'Present Perfect with duration phrases ("in a while / in ages") vs. Preposition traps.',
      options: [
        {
          id: 'opt_5_opt',
          text: "Same here, I haven't laughed this much in ages.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Aww, that makes me so happy to hear! Today really felt special to me too.",
          ruleNote: "Use the present perfect with 'in ages' or 'in a while' to describe an ongoing state up to now."
        },
        {
          id: 'opt_5_gr',
          text: "Same here, I didn't laugh this much since ages.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "Aww, you haven't laughed in ages? Just a small language note: we say 'for ages' or 'in ages', not 'since ages'! But that's so sweet.",
          ruleNote: "'Ages' is a duration of time, so it pairs with 'in' or 'for', not 'since'."
        },
        {
          id: 'opt_5_pr',
          text: "I usually find dates boring, but this was okay.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Just... okay? Calling our date 'not completely boring' isn't exactly the compliment I hoped for.",
          ruleNote: "Avoid backhanded compliments when someone expresses genuine romantic warmth."
        }
      ]
    }
  ],

  // =========================================================================
  // 2. FOOD, TASTE & HEALTH VOCABULARY (Skyline Terrace)
  // =========================================================================
  food_and_health: [
    {
      id: 'fah_1',
      narrativeLeadIn: "Candlelight flickers on the rooftop table. The smell of delicious food fills the evening air.",
      partnerSpeech: "Everything on this dinner menu smells incredible. Are you more into sweet treats or savory dishes?",
      initialExpression: 'happy',
      pedagogicalFocus: 'Food flavor collocations: "savory" vs "sweet" and sense-verb adjective rules.',
      options: [
        {
          id: 'opt_1_opt',
          text: "I usually lean toward savory bites with fresh herbs.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Same here! There's an herbed mushroom flatbread on the menu that looks absolutely delicious.",
          ruleNote: "'Savory' describes salty, herbal, or umami food that isn't sweet."
        },
        {
          id: 'opt_1_gr',
          text: "I usually like savory dishes because they taste so well.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "They taste so good, you mean? Linking verbs like 'taste' take adjectives like 'good', not 'well'! But I totally agree.",
          ruleNote: "Sense verbs (taste, smell, look) take adjectives ('tastes good'), not adverbs ('tastes well')."
        },
        {
          id: 'opt_1_pr',
          text: "Both are terrible for your arteries and cause bloating.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Whoa, okay doctor. I thought we were here to enjoy dinner together, not count arterial plaque.",
          ruleNote: "Lecturing your partner about health hazards ruins the appetite and dinner atmosphere."
        }
      ]
    },
    {
      id: 'fah_2',
      narrativeLeadIn: "The waiter brings out a warm roast chicken platter with fresh herbs.",
      partnerSpeech: "Look at the golden crust on this chicken! How does it taste to you?",
      initialExpression: 'happy',
      pedagogicalFocus: 'Describing texture and flavor: "crispy", "tender", vs. "greasy", "bland".',
      options: [
        {
          id: 'opt_2_opt',
          text: "The skin is wonderfully crispy and the meat is tender.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Right? It's cooked to perfection! The rosemary seasoning really brings it all together.",
          ruleNote: "'Crispy' (pleasant crunch) and 'tender' (soft and juicy) are ideal positive descriptors for poultry."
        },
        {
          id: 'opt_2_gr',
          text: "The skin is very crunch and it melts in mouth.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "Very crunchy, you mean? 'Crunch' is a noun, but 'crunchy' is the adjective! And 'in the mouth' needs 'the'! But yeah, it's great.",
          ruleNote: "Use the adjective form 'crunchy' or 'crispy', not the noun 'crunch'."
        },
        {
          id: 'opt_2_pr',
          text: "It is way too greasy and drenched in cheap butter.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Oh... well, I thought it tasted really good. Now you've made me feel weird about eating it.",
          ruleNote: "Describing shared food in unappetizing terms kills the enjoyment of the meal."
        }
      ]
    },
    {
      id: 'fah_3',
      narrativeLeadIn: "The city lights glow in the distance. Your date takes a slow sip of water.",
      partnerSpeech: "I’ve been trying to stay energized lately by drinking lots of water and walking. Do you follow any wellness habits?",
      initialExpression: 'thoughtful',
      pedagogicalFocus: 'Health & wellness collocations: "keep a balanced diet", "stay in shape".',
      options: [
        {
          id: 'opt_3_opt',
          text: "I try to keep a balanced diet and go running.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "That's great! Running in the morning clears your head like nothing else.",
          ruleNote: "Collocation: We say 'keep/maintain a balanced diet', meaning eating nutritious foods."
        },
        {
          id: 'opt_3_gr',
          text: "I try eating healthy foods for making myself strong.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "To make yourself strong, you mean? In English, purpose is usually 'to make', not 'for making'! But that's a great habit.",
          ruleNote: "Express personal purpose with 'to + infinitive' (to stay healthy), not 'for + gerund'."
        },
        {
          id: 'opt_3_pr',
          text: "Wellness routines are just trendy scams for gullible people.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'shocked',
          characterReaction: "Gullible? I was just sharing something that helps me feel less tired... that was uncalled for.",
          ruleNote: "Respect your partner's positive personal lifestyle efforts rather than calling them scams."
        }
      ]
    },
    {
      id: 'fah_4',
      narrativeLeadIn: "The waiter sets down a small bowl of spicy red chili oil.",
      partnerSpeech: "They have a house-made hot oil here. Can you handle spicy food, or should we ask for mild?",
      initialExpression: 'happy',
      pedagogicalFocus: 'Describing heat tolerance: "a bit of a kick", "handle spice well".',
      options: [
        {
          id: 'opt_4_opt',
          text: "I enjoy a subtle kick, but let's keep mild handy.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Sounds like a solid plan! We get the flavor without burning our tastebuds off.",
          ruleNote: "In culinary English, 'a kick' refers to a pleasant spicy or tangy sharpness."
        },
        {
          id: 'opt_4_gr',
          text: "I can eat spicy very good, so don't worry for me.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "You handle spice very well, you mean? 'Good' is an adjective, 'well' is an adverb! And 'worry about me'! But alright, brave one!",
          ruleNote: "Use the adverb 'well' to modify verbs ('eat well'), and say 'worry about', not 'worry for'."
        },
        {
          id: 'opt_4_pr',
          text: "Only boring cowards eat mild food, so order the hottest.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Boring cowards? Wow, aggressive much? Food is supposed to be enjoyable, not a macho test.",
          ruleNote: "Never insult someone's dietary preferences or culinary comfort zone."
        }
      ]
    },
    {
      id: 'fah_5',
      narrativeLeadIn: "The dinner plates are cleared away. The table is cozy and quiet.",
      partnerSpeech: "Phew, that was hearty! I'm honestly so full I couldn't eat another bite. How are you feeling?",
      initialExpression: 'blushing',
      pedagogicalFocus: 'Describing fullness: "stuffed", "pleasantly full", vs bodily complaints.',
      options: [
        {
          id: 'opt_5_opt',
          text: "I'm completely stuffed too, but in the best way possible.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'blushing',
          characterReaction: "Haha, totally! That was hands-down one of the best dinners I've had in months.",
          ruleNote: "Informal idiom: 'I'm stuffed' means you have eaten plenty and feel completely satisfied."
        },
        {
          id: 'opt_5_gr',
          text: "My stomach is so fulling that I can barely stand.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "So full, you mean? The food was 'filling', but your stomach is 'full'! But yeah, I don't want to get up either.",
          ruleNote: "Food is 'filling' (heavy/hearty), while people feel 'full' (satisfied after eating)."
        },
        {
          id: 'opt_5_pr',
          text: "I feel nauseous and regret eating almost everything tonight.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Nauseous? Oh dear... that really ruins the romance of the dinner we just had.",
          ruleNote: "Avoid graphic bodily complaints after a romantic dinner date."
        }
      ]
    }
  ],

  // =========================================================================
  // 3. LITERAL MEANING VS. PRAGMATIC INFERENCES (Blue Horizon Aquarium)
  // =========================================================================
  pragmatic_inference: [
    {
      id: 'pi_1',
      narrativeLeadIn: "Soft blue light fills the aquarium tunnel as big stingrays glide above you.",
      partnerSpeech: "Brr, it feels a little chilly right under this air vent, doesn't it?",
      initialExpression: 'thoughtful',
      pedagogicalFocus: 'Decoding indirect requests: understanding that a temperature comment is a hint to move.',
      options: [
        {
          id: 'opt_1_opt',
          text: "It really is. Let's step over toward the warmer tunnel.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Thank you so much! You're really observant. It's much cozier over here.",
          ruleNote: "Pragmatic cue: Commenting on discomfort ('It's chilly') is usually an indirect hint to change location."
        },
        {
          id: 'opt_1_gr',
          text: "It is chilly, so let's to step away from vent.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "Let's step, you mean? No 'to' after 'let's'! But yes, thank you for noticing, let's walk over here.",
          ruleNote: "Never put 'to' after 'let's': say 'let's step', not 'let's to step'."
        },
        {
          id: 'opt_1_pr',
          text: "The digital display over there says it is nineteen degrees.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Um... okay? I wasn't quizzing you on the temperature, I was telling you I'm cold.",
          ruleNote: "Don't treat human hints like literal data questions; respond to the underlying social need."
        }
      ]
    },
    {
      id: 'pi_2',
      narrativeLeadIn: "You stop at a wooden bench and take a fresh snack from your bag.",
      partnerSpeech: "Ooh, that bakery snack you bought earlier smells so sweet and warm!",
      initialExpression: 'happy',
      pedagogicalFocus: 'Decoding indirect hints: praising food is an implicit signal of wanting a taste.',
      options: [
        {
          id: 'opt_2_opt',
          text: "It really does! Here, break off half for yourself.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'blushing',
          characterReaction: "Aww, are you sure? You're so sweet! Mmm, it's still warm in the middle.",
          ruleNote: "Pragmatic cue: Complimenting someone's treat is a polite, indirect way of expressing interest in sharing."
        },
        {
          id: 'opt_2_gr',
          text: "It does! Do you want to drink a bite too?",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "Drink a bite? Haha, you mean take a bite! But yes, thank you, I'd love a piece.",
          ruleNote: "Collocation: We say 'take a bite' or 'have a bite' for solid food, never 'drink a bite'."
        },
        {
          id: 'opt_2_pr',
          text: "Thanks, the artisan bakery makes only five batches daily.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Oh... cool story. I guess you're keeping it all for yourself then.",
          ruleNote: "Recognize sharing cues rather than turning a partner's hint into a brag about scarcity."
        }
      ]
    },
    {
      id: 'pi_3',
      narrativeLeadIn: "Glowing jellyfish float gently in a dark glass tank.",
      partnerSpeech: "I just noticed the express train back to my neighborhood stops running around ten.",
      initialExpression: 'thoughtful',
      pedagogicalFocus: 'Decoding departure hints: mentioning transit deadlines signals time awareness.',
      options: [
        {
          id: 'opt_3_opt',
          text: "Good to know. I'll make sure we watch the clock.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Thanks! I appreciate you being considerate about that. It helps me relax and enjoy our time.",
          ruleNote: "Pragmatic cue: Mentioning travel schedules signals a temporal boundary that should be honored."
        },
        {
          id: 'opt_3_gr',
          text: "Good to know. I will make sure we don't lost time.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "Don't lose track of time, right? After 'don't', use the base form 'lose'! But thank you for keeping an eye on it.",
          ruleNote: "Use the base form after auxiliary verbs: 'don't lose', not 'don't lost'."
        },
        {
          id: 'opt_3_pr',
          text: "You can easily take an expensive late-night taxi instead.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'shocked',
          characterReaction: "An expensive taxi? Why would I waste money on that when I gave you my train time?",
          ruleNote: "Don't dismiss someone's travel boundaries by telling them to spend extra money."
        }
      ]
    },
    {
      id: 'pi_4',
      narrativeLeadIn: "You both walk past a big poster for an ocean movie.",
      partnerSpeech: "Hmm, that special documentary is nearly three hours long. That's quite a commitment, huh?",
      initialExpression: 'puzzled',
      pedagogicalFocus: 'Decoding reluctance: pointing out a drawback usually implies hesitation.',
      options: [
        {
          id: 'opt_4_opt',
          text: "That is pretty lengthy. Let's stick to the exhibits instead.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Whew, I'm glad we're on the same page! Walking around feels much more fun than sitting still.",
          ruleNote: "Pragmatic cue: Calling attention to a negative feature ('quite a commitment') signals mild reluctance."
        },
        {
          id: 'opt_4_gr',
          text: "That is long. Maybe we should to skip the movie?",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "We should skip, you mean? No 'to' after modal verbs like 'should'! But yes, skipping it sounds great.",
          ruleNote: "Never use 'to' after modal verbs: 'we should skip', not 'we should to skip'."
        },
        {
          id: 'opt_4_pr',
          text: "Three hours is nothing, so stop being lazy and buy tickets.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Lazy? Excuse me? You don't get to order me around like that.",
          ruleNote: "Never pressure your date into an activity after they express hesitation."
        }
      ]
    },
    {
      id: 'pi_5',
      narrativeLeadIn: "You step outside the aquarium into the cool evening air.",
      partnerSpeech: "My upcoming weekend is pretty hectic, but I might have an hour free on Sunday afternoon.",
      initialExpression: 'blushing',
      pedagogicalFocus: 'Decoding selective availability: offering a small window is an invitation for a low-pressure date.',
      options: [
        {
          id: 'opt_5_opt',
          text: "How about a quick coffee then? Totally relaxed and easy.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'blushing',
          characterReaction: "I'd love that! A quick coffee break sounds like the perfect breather for my weekend.",
          ruleNote: "When someone offers a small window of availability, match it with a light, low-pressure suggestion."
        },
        {
          id: 'opt_5_gr',
          text: "How about we meeting for coffee then? Totally relaxed and easy.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "How about we meet, you mean? 'We meet' or 'how about meeting'! But yes, I'd really like that.",
          ruleNote: "Structure: 'How about we + base verb' (How about we meet) OR 'How about + -ing' (How about meeting)."
        },
        {
          id: 'opt_5_pr',
          text: "One hour is barely worth the commute, so let's skip it.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Barely worth it? I went out of my way to make time for you, and you just blew it off.",
          ruleNote: "Treat small openings of time as valuable gestures of interest rather than inconveniences."
        }
      ]
    }
  ],

  // =========================================================================
  // 4. POLITE SUGGESTIONS & INDIRECT REQUESTS (Sunset Carnival)
  // =========================================================================
  polite_requests: [
    {
      id: 'pr_1',
      narrativeLeadIn: "Bright carnival lights glow in the dusk. You can hear cheerful music all around.",
      partnerSpeech: "The fairground looks so lively right now! What do you feel like checking out first?",
      initialExpression: 'happy',
      pedagogicalFocus: 'Making collaborative proposals: "Why don\'t we...", "How about we...".',
      options: [
        {
          id: 'opt_1_opt',
          text: "Why don't we try the ring toss game over there?",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Yes! Let's see who has the better aim. Winner buys the next churro!",
          ruleNote: "Pattern: 'Why don't we + base verb' is the quintessential friendly proposal in English."
        },
        {
          id: 'opt_1_gr',
          text: "Why don't we trying the ring toss game over there?",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "Why don't we try, right? Base verb after 'why don't we'! But oh yes, ring toss sounds super fun!",
          ruleNote: "Always use the base form of the verb after 'Why don't we...': 'Why don't we try'."
        },
        {
          id: 'opt_1_pr',
          text: "You must buy me tickets for the roller coaster right now.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "I 'must'? We just got here, and you're already barking orders at me?",
          ruleNote: "Never phrase date suggestions as compulsory commands ('You must buy me')."
        }
      ]
    },
    {
      id: 'pr_2',
      narrativeLeadIn: "A cool evening breeze blows across the boardwalk bridge.",
      partnerSpeech: "This boardwalk bench is right in the path of the lake breeze. Is it bothering you at all?",
      initialExpression: 'thoughtful',
      pedagogicalFocus: 'Polite adjustment requests: "Would you mind if we...", "Could we possibly...".',
      options: [
        {
          id: 'opt_2_opt',
          text: "A bit. Would you mind if we moved near the lanterns?",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Not at all! Good call—the lanterns are much warmer and the view is even prettier.",
          ruleNote: "Pattern: 'Would you mind if we + past verb' (Would you mind if we moved) shows high-register politeness."
        },
        {
          id: 'opt_2_gr',
          text: "A bit. Would you mind if we move near the lanterns?",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "If we moved, technically! Conditional 'would you mind if' takes the past tense. But let's definitely head over there.",
          ruleNote: "Polite conditional: 'Would you mind if I/we + past verb' (moved, sat, opened)."
        },
        {
          id: 'opt_2_pr',
          text: "Yes, this bench is horrible and you picked a terrible spot.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "I just sat down where there was space! You don't need to insult my judgment like that.",
          ruleNote: "Request location changes courteously without blaming your date."
        }
      ]
    },
    {
      id: 'pr_3',
      narrativeLeadIn: "The big Ferris wheel glows bright gold behind your smiling date.",
      partnerSpeech: "The lights behind the Ferris wheel look so magical right now. Could you take a picture of me?",
      initialExpression: 'blushing',
      pedagogicalFocus: 'Polite offers of help: "I\'d be glad to", "Let me get that for you".',
      options: [
        {
          id: 'opt_3_opt',
          text: "I'd be glad to! Step right by the archway and smile.",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'blushing',
          characterReaction: "Aww, thank you! You're the best. Make sure to get the top of the wheel in the frame!",
          ruleNote: "Collocation: 'I'd be glad to / I'd love to' is the standard polite response to a favor request."
        },
        {
          id: 'opt_3_gr',
          text: "I am glad to! Step near arch and I take picture.",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'puzzled',
          characterReaction: "I'd be glad to, you mean? Don't forget 'would' for offers, and 'a picture'! But here's my phone, thanks!",
          ruleNote: "Use the conditional 'I'd be glad to' for polite offers, and include articles with singular count nouns."
        },
        {
          id: 'opt_3_pr',
          text: "Make it quick because standing around taking photos is annoying.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "Never mind then. If taking one photo is such a chore for you, forget I asked.",
          ruleNote: "Fulfill small social favors with genuine warmth rather than visible annoyance."
        }
      ]
    },
    {
      id: 'pr_4',
      narrativeLeadIn: "A sweet smell of warm cinnamon and sugar comes from a dessert cart.",
      partnerSpeech: "Both of these look incredible—the strawberry funnel cake and the caramel apple. Which should we get?",
      initialExpression: 'happy',
      pedagogicalFocus: 'Shared suggestions: "Shall we get both and split them?", "How about we...".',
      options: [
        {
          id: 'opt_4_opt',
          text: "Shall we just get both and split them down the middle?",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'happy',
          characterReaction: "Now that is a brilliant compromise! I love how you think. Let's do it!",
          ruleNote: "Pattern: 'Shall we + base verb' offers a shared proposal with warmth and charm."
        },
        {
          id: 'opt_4_gr',
          text: "Shall we getting both and share them in the middle?",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "Shall we get, you mean? 'Shall we' takes the base verb, not -ing! But yes, sharing both is genius.",
          ruleNote: "After 'Shall we', always use the bare infinitive: 'Shall we get'."
        },
        {
          id: 'opt_4_pr',
          text: "Order whatever you want, but I am definitely not paying for it.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'disappointed',
          characterReaction: "I never asked you to pay for mine! Bringing that up so defensively is really uncalled for.",
          ruleNote: "Avoid bringing up financial hostility in the middle of a playful food dilemma."
        }
      ]
    },
    {
      id: 'pr_5',
      narrativeLeadIn: "The carnival lights slowly dim as the night comes to an end.",
      partnerSpeech: "The night went by so quickly. I really loved walking around the carnival with you.",
      initialExpression: 'blushing',
      pedagogicalFocus: 'Suggesting future dates: "Would you like to...", "Could I walk you to...".',
      options: [
        {
          id: 'opt_5_opt',
          text: "I did too. Would you like me to walk you to your station?",
          type: 'optimal',
          impact: 25,
          reactionExpression: 'blushing',
          characterReaction: "I'd really love that. Having your company for a little longer would be wonderful.",
          ruleNote: "Pattern: 'Would you like me to + verb' politely offers assistance while respecting their comfort."
        },
        {
          id: 'opt_5_gr',
          text: "I did too. Do you want that I walk you to the station?",
          type: 'grammar_error',
          impact: -10,
          reactionExpression: 'thoughtful',
          characterReaction: "Do you want me to walk you, right? In English we say 'want someone to do something'! But yes, please walk with me.",
          ruleNote: "Syntax: 'want + object + to-infinitive' (want me to walk), NOT 'want that I walk'."
        },
        {
          id: 'opt_5_pr',
          text: "Yeah, you should probably leave before the trains stop running.",
          type: 'pragmatic_mismatch',
          impact: -15,
          reactionExpression: 'shocked',
          characterReaction: "Geez, eager to get rid of me? That was a pretty cold way to end the night.",
          ruleNote: "Conclude dates with gracious offers of accompaniment rather than abrupt dismissals."
        }
      ]
    }
  ]
};

// Shuffles an array randomly
export function shuffleOptions<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
