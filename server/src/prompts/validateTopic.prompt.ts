type ValidateTopicPromptInput = {
  topic: string;
  reportTitle: string;
  notes: string | null;
};

export function buildValidateTopicPrompt(input: ValidateTopicPromptInput): string {
  return `You gate oral recitation practice sessions for students.

Decide whether the inputs describe a real educational lesson, subject, chapter, skill, or presentation topic suitable for classroom Q&A.

Topic: ${input.topic}
Report title: ${input.reportTitle}
Notes: ${input.notes ?? "(none)"}

REJECT: gibberish, random characters, placeholder text, nonsense, joke inputs, or content with no clear academic subject will be not accepted. (e.g. "asdf", "12345", "xxx", "test test", "qwerty").

ACCEPT: legitimate school subjects, lessons, report topics, and study material (e.g. "Photosynthesis", "Database Normalization", "Philippine Revolution").

Reply with JSON only: {"valid": boolean, "reason": string}`;
}
