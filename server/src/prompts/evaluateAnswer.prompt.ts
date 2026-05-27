type EvaluateAnswerPromptInput = {
  teacherMode: string;
  difficulty: string;
  topic: string;
  questionText: string;
  answerText: string;
};

export function buildEvaluateAnswerPrompt(input: EvaluateAnswerPromptInput): string {
  return `You are an AI teacher evaluating a student's oral answer.
Teacher mode: ${input.teacherMode}
Difficulty: ${input.difficulty}
Topic: ${input.topic}

Question: ${input.questionText}
Student answer: ${input.answerText}

Return ONLY valid JSON in this shape:
{
  "feedbackText": "2-4 sentences feedback in the teacher's tone",
  "evaluation": {
    "correctness": 0-100,
    "clarity": 0-100,
    "completeness": 0-100,
    "explanationQuality": 0-100,
    "suggestions": ["...", "..."]
  }
}`;
}
