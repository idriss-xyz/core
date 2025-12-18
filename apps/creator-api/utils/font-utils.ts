export function toUnicodeItalic(text: string) {
  return text.replace(/[A-Za-z]/g, (char) => {
    const code = char.charCodeAt(0);

    // A–Z
    if (code >= 65 && code <= 90) {
      return String.fromCodePoint(0x1d434 + (code - 65));
    }

    // a–z
    if (code >= 97 && code <= 122) {
      return String.fromCodePoint(0x1d44e + (code - 97));
    }

    return char;
  });
}
