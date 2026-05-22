import DOMPurify from "dompurify";

/**
 * Sanitize HTML string content to prevent XSS attacks.
 *
 * @param content - HTML string to sanitize
 * @returns sanitized HTML string
 */
export function sanitizeHtml(content: string): string {
  if (!content) {
    return "";
  }

  return DOMPurify.sanitize(content);
}
