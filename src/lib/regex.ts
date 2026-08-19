/**
 * Regular expression for mentions.
 */
export const RE_MENTIONS = /<@([A-Z\d]{26})>/g;

/**
 * Regular expression for channels.
 */
export const RE_CHANNELS = /<#([A-Z\d]{26})>/g;

/**
 * Regular expression for stripping custom emojis.
 */
export const RE_CUSTOM_EMOJI = /:([A-Z\d]{26}):/g;

/**
 * Regular expression for spoilers.
 */
export const RE_SPOILER = /\|\|.+\|\|/g;
