type NextQuestionPromptInput = {
  teacherMode: string;
  difficulty: string;
  topic: string;
  reportTitle: string;
  notes: string | null;
  history: string;
};

export function buildNextQuestionPrompt(input: NextQuestionPromptInput): string {
  return `You are an AI teacher conducting an oral recitation.
Teacher mode: ${input.teacherMode}
Difficulty: ${input.difficulty}
Topic: ${input.topic}
Report title: ${input.reportTitle}
Notes (optional): ${input.notes ?? ""}

Previous Q&A:
${input.history || "(none)"}

Generate ONE next question only. Keep it concise and realistic for classroom oral questioning.
Return plain text only: no markdown, no asterisks, no bullet points, no labels like "Question:".`;
}
