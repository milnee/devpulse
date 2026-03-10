/**
 * Validates and normalises a user-supplied string into a bare GitHub username.
 *
 * Accepts:
 *  - Plain username:          "torvalds"
 *  - GitHub profile URL:      "https://github.com/torvalds"
 *  - GitHub repo URL:         "https://github.com/torvalds/linux"  → "torvalds"
 *  - With or without www / trailing slash
 */

const USERNAME_RE = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;

export function parseUsername(input: string): { username: string } | { error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { error: "Please enter a GitHub username or URL." };

  // Try to extract from a github.com URL
  const urlMatch = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#\s]+)/i
  );
  if (urlMatch) {
    const candidate = urlMatch[1];
    if (!USERNAME_RE.test(candidate)) {
      return { error: `"${candidate}" doesn't look like a valid GitHub username.` };
    }
    return { username: candidate };
  }

  // Treat as bare username
  if (!USERNAME_RE.test(trimmed)) {
    return {
      error:
        "GitHub usernames can only contain alphanumeric characters or hyphens, " +
        "cannot start or end with a hyphen, and are max 39 characters.",
    };
  }

  return { username: trimmed };
}
