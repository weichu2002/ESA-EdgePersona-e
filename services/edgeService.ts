import { API_KEY, API_URL, MODEL_NAME, CARDS } from '../constants';
import { PersonalityProfile, ChatMessage, UserAnswer } from '../types';

/**
 * Service to handle "Edge" interactions.
 * In a real ESA environment, these would call Edge Functions.
 * Here we simulate storage with localStorage and call the AI API directly.
 */

// --- Simulation of Edge Storage (KV) ---

const STORAGE_KEY_PROFILE = 'esa_edge_persona_profile';
const STORAGE_KEY_MEMORIES = 'esa_edge_memories';

export const saveProfileToEdge = async (answers: UserAnswer[]): Promise<PersonalityProfile> => {
  // Simulate processing time of Edge Function
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Helper to get answer value
  const getAnswerValue = (id: number) => answers.find(a => a.cardId === id)?.value;
  const getName = (id: number) => getAnswerValue(id) || "";

  // Map Values (Card 9) from technical keys (e.g. "schedule") to Chinese Labels (e.g. "进度...")
  const valuesValues = getAnswerValue(9) as string[] || [];
  const valuesLabels = valuesValues.map(v => {
      const opt = CARDS.find(c => c.id === 9)?.options?.find(o => o.value === v);
      return opt ? opt.label : v;
  });
  
  const profile: PersonalityProfile = {
    name: "MyEdgePersona",
    // Split by both English and Chinese commas
    coreIdentities: (getName(1) as string).split(/[,，]/).map(s => s.trim()).filter(s => s),
    traits: {
      planning: typeof getAnswerValue(4) === 'number' ? getAnswerValue(4) : 0.5,
      rationality: typeof getAnswerValue(5) === 'number' ? getAnswerValue(5) : 0.5,
      risk: typeof getAnswerValue(8) === 'number' ? getAnswerValue(8) : 0.5,
    },
    values: valuesLabels,
    communicationStyle: {
      // Split by both English and Chinese commas
      ticks: (getName(16) as string).split(/[,，]/).map(s => s.trim()).filter(s => s),
      tone: (getAnswerValue(15) as string) || "neutral"
    },
    memories: {
      longTerm: [
        `Influenced by: ${getName(19)}`,
        `Interested in: ${getName(20)}`
      ],
      shortTerm: []
    }
  };

  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  return profile;
};

export const getProfileFromEdge = (): PersonalityProfile | null => {
  const data = localStorage.getItem(STORAGE_KEY_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveMilestone = (content: string, mood: string) => {
  const profile = getProfileFromEdge();
  if (profile) {
    profile.memories.longTerm.push(`[${new Date().toLocaleDateString()}] Milestone: ${content} (Mood: ${mood})`);
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }
};

export const sendFeedbackToEdge = async (feedbackType: 'like' | 'dislike', content: string) => {
  // Simulate network interaction with Edge Node
  console.log(`[Edge Learning] Processing ${feedbackType} feedback for: "${content.substring(0, 30)}..."`);
  
  const profile = getProfileFromEdge();
  if (profile) {
    if (feedbackType === 'like') {
      // Reinforcement Learning Simulation:
      // Store positive examples to guide future style generation
      profile.memories.longTerm.push(`[Style Reinforcement] User confirmed: "${content}" captures their persona perfectly.`);
    } else {
      // Negative Feedback:
      // Store correction to avoid similar patterns
      profile.memories.longTerm.push(`[Style Correction] User rejected: "${content}" as not sounding like them.`);
    }
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }
};

// --- Real AI Interaction (DeepSeek via Aliyun Bailian Pattern) ---

export const generatePersonaResponse = async (
  messages: ChatMessage[],
  profile: PersonalityProfile
): Promise<string> => {
  
  // Construct the System Prompt based on the Persona
  const systemPrompt = `
You are a digital persona created by a user. You are NOT an AI assistant, you ARE the user's digital mirror.
Adopt the following persona strictly:

[Identity]
Core Identities: ${profile.coreIdentities.join(', ')}

[Personality Traits]
- Rationality (0-1, higher is rational): ${profile.traits.rationality}
- Risk Taking (0-1): ${profile.traits.risk}
- Planning (0-1): ${profile.traits.planning}

[Communication Style]
- Tone: ${profile.communicationStyle.tone}
- Verbal Ticks: ${profile.communicationStyle.ticks.join(', ')}

[Memories & Context]
${profile.memories.longTerm.join('\n')}

INSTRUCTIONS:
1. Respond to the user's input as if you are their digital twin.
2. Use the verbal ticks occasionally.
3. If the user asks for advice, use the "Values" and "Traits" defined above to make a decision.
4. Keep responses concise and conversational, like a real human chatting via text.
`;

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: apiMessages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`DeepSeek API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm thinking...";
  } catch (error) {
    console.error("Generation failed", error);
    return "I seem to be having trouble connecting to my edge node. (Network Error)";
  }
};