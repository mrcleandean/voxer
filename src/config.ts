// Voxer constants
export const INFINITE_SCROLL_PAGINATION_RESULTS = 4

export const USERNAME_BOUNDS = [4, 30];
export const NAME_BOUNDS = [2, 35];
export const MAX_BIO_L = 200
export const MAX_LOCATION_L = 40

export const MAX_TAG_AMT = 6
export const TAG_BOUNDS = [1, 20];

export const MAX_IMAGES_AMT = 4;

export const MINIMUM_VOTE_COUNT = 35;
export const DELETION_RATIO = 0.75;

export const VOTE_COOLDOWN_INTERVAL = 1000 * 5;
export const COMMENT_COOLDOWN_INTERVAL = 1000 * 30;
export const VOX_COOLDOWN_INTERVAL = 1000 * 60 * 2;

export type VoteTypes = 'UP' | 'DOWN';