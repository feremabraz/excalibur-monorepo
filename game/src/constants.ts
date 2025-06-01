import * as ex from "excalibur";

export const VIEWPORT_WIDTH = 160 + 48;
export const VIEWPORT_HEIGHT = 144 + 48;

export const SCALE = 2;
export const SCALE_2x = new ex.Vector(2, 2);

export const ANCHOR_CENTER = new ex.Vector(0.5, 0.5);
export const ANCHOR_TOP_LEFT = new ex.Vector(0, 0);

export const LEFT = "LEFT" as const;
export const RIGHT = "RIGHT" as const;
export const UP = "UP" as const;
export const DOWN = "DOWN" as const;
export type Direction = typeof LEFT | typeof RIGHT | typeof UP | typeof DOWN;

export const WALK = "WALK";
export const SWORD1 = "SWORD1";
export const SWORD2 = "SWORD2";
export const PAIN = "PAIN";

export const SWORDACTION = "SWORDACTION";
export const ARROWACTION = "ARROWACTION";

export const TAG_ANY_PLAYER = "TAG_ANY_PLAYER";
export const TAG_PLAYER_WEAPON = "TAG_PLAYER_WEAPON";
export const TAG_DAMAGES_PLAYER = "TAG_DAMAGES_PLAYER";
