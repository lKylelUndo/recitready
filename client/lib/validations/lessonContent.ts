const LETTER_REGEX = /[a-zA-Z\u00C0-\u024F]/g;
const VOWEL_REGEX = /[aeiouAEIOU\u00C0-\u024F]/;
const GIBBERISH_WORDS = new Set([
  "asdf",
  "qwerty",
  "zxcv",
  "test",
  "xxx",
  "aaa",
  "abc",
  "lol",
  "haha",
  "none",
  "na",
  "n/a",
  "random",
  "sample",
  "placeholder",
]);

export function validateLessonContent(
  text: string,
  options?: { optional?: boolean; fieldLabel?: string }
): { valid: boolean; message: string } {
  const label = options?.fieldLabel ?? "This field";
  const trimmed = text.trim();

  if (!trimmed) {
    if (options?.optional) return { valid: true, message: "" };
    return { valid: false, message: `${label} is required.` };
  }

  const letters = trimmed.match(LETTER_REGEX) ?? [];
  const digits = trimmed.match(/\d/g) ?? [];

  if (letters.length < 2) {
    return {
      valid: false,
      message: `${label} must be a real lesson or topic name, not only numbers or symbols.`,
    };
  }

  if (digits.length / trimmed.replace(/\s/g, "").length > 0.4) {
    return {
      valid: false,
      message: `${label} cannot be mostly numbers.`,
    };
  }

  const letterOnly = letters.join("");
  if (letterOnly.length >= 4 && !VOWEL_REGEX.test(letterOnly)) {
    return {
      valid: false,
      message: `${label} must look like a recognizable lesson or topic title.`,
    };
  }

  if (/^(.)\1{4,}$/i.test(trimmed.replace(/\s/g, ""))) {
    return {
      valid: false,
      message: `${label} cannot be repeated random characters.`,
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const normalizedWords = words.map((word) => word.replace(/[^a-z0-9]/gi, "").toLowerCase());

  if (words.length === 1 && words[0].replace(/[^a-zA-Z]/g, "").length < 4) {
    return {
      valid: false,
      message: `${label} must be more descriptive (at least 4 letters for a single-word topic).`,
    };
  }

  if (normalizedWords.every((word) => GIBBERISH_WORDS.has(word))) {
    return {
      valid: false,
      message: `${label} must describe a real lesson or topic, not placeholder text.`,
    };
  }

  if (
    words.length === 1 &&
    /\d/.test(trimmed) &&
    /[a-z]/i.test(trimmed) &&
    (letterOnly.match(VOWEL_REGEX) ?? []).length < 1
  ) {
    return {
      valid: false,
      message: `${label} must be a real lesson or topic, not random characters.`,
    };
  }

  return { valid: true, message: "" };
}
