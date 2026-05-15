"use server";

import { callAi } from "@/lib/ai-provider";
import { getDb } from "@/lib/db";

type EditorAiAction = 
  | 'improve'
  | 'professional'
  | 'shorter'
  | 'longer'
  | 'fix_grammar'
  | 'custom';

export async function generateEditorContent(
  prompt: string, 
  context?: string, 
  actionType: EditorAiAction = 'custom'
) {
  try {
    let aiPrompt = "";

    if (actionType === 'custom') {
      aiPrompt = context 
        ? `Given the following text: "${context}"\n\nPerform this instruction: ${prompt}` 
        : `Generate content based on this instruction: ${prompt}`;
    } else {
      if (!context) {
        throw new Error("Context text is required for refine actions.");
      }

      switch (actionType) {
        case 'improve':
          aiPrompt = `Improve the writing of the following text, making it clear, engaging, and well-structured. Return only the improved text. Text: "${context}"`;
          break;
        case 'professional':
          aiPrompt = `Rewrite the following text to sound highly professional, suitable for a business or formal portfolio context. Return only the rewritten text. Text: "${context}"`;
          break;
        case 'shorter':
          aiPrompt = `Summarize and make the following text more concise without losing its core meaning. Return only the shortened text. Text: "${context}"`;
          break;
        case 'longer':
          aiPrompt = `Expand on the following text, adding more detail and elaborating on the points. Return only the expanded text. Text: "${context}"`;
          break;
        case 'fix_grammar':
          aiPrompt = `Fix all spelling and grammatical errors in the following text. Do not change the meaning or tone. Return only the corrected text. Text: "${context}"`;
          break;
      }
    }

    let model: 'gemini-pro' | 'gemini-vision' | 'mistral-large' | 'gpt-4o' = 'gemini-pro';
    try {
      const db = await getDb();
      const globalConfig = await db.collection("settings").findOne({});
      if (globalConfig?.globalAiModel) {
         model = globalConfig.globalAiModel as any;
      }
    } catch (e) {
      console.error("Error fetching AI settings, defaulting to gemini-pro", e);
    }

    const response = await callAi({
      model: model,
      prompt: aiPrompt
    });

    if (response.error) throw new Error(response.error);

    return { success: true, content: response.content };
  } catch (error: any) {
    console.error("Editor AI Error:", error);
    return { success: false, error: error.message };
  }
}
