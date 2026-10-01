/**
 * An expected "this goal cannot be reached" outcome whose message is written for the saver to read.
 * Anything else that is thrown is a bug and must never reach the screen as raw text.
 */
export class PlainWordsError extends Error {
  /**
   * @param message - Plain-words explanation shown to the saver as is
   */
  constructor(message: string) {
    super(message);
    this.name = "PlainWordsError";
  }
}
