export function recoverJSON(text: string): string {

  // Remove markdown code fences
  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "");

  // Remove leading/trailing whitespace
  text = text.trim();

  // Find first JSON character
  const firstBrace = Math.min(
    ...["[", "{"]
      .map(c => text.indexOf(c))
      .filter(i => i >= 0)
  );

  if (firstBrace > 0) {
    text = text.substring(firstBrace);
  }

  return text;
}