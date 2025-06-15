import * as ex from 'excalibur';

export const Fonts = {
  UI_FONT_FAMILY: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  GAME_FONT_FAMILY: 'sans-serif',
};

export const Colors = {
  PRIMARY_TEXT: ex.Color.White,
  SECONDARY_TEXT: ex.Color.Gray,
  BACKGROUND_DARK: ex.Color.Black,
  BUTTON_BACKGROUND_HEX: '#1a1a1a',
  BUTTON_BORDER_HEX: '#2b2b2b',
  DEBUG_RED: ex.Color.Red,
};

export const FontSizes = {
  LARGE_TITLE: 32,
  MEDIUM_TITLE: 30,
  SUBTITLE: 20,
  SPLASH_SUBTITLE: 18,
  BUTTON_TEXT: 16,
};

export const GameText = {
  LoaderTitleFont: new ex.Font({
    family: Fonts.GAME_FONT_FAMILY,
    size: FontSizes.MEDIUM_TITLE,
    color: Colors.PRIMARY_TEXT,
    textAlign: ex.TextAlign.Center,
  }),
  LoaderSubtitleFont: new ex.Font({
    family: Fonts.GAME_FONT_FAMILY,
    size: FontSizes.SUBTITLE,
    color: Colors.PRIMARY_TEXT,
    textAlign: ex.TextAlign.Center,
  }),
  SplashTitleFont: new ex.Font({
    family: Fonts.GAME_FONT_FAMILY,
    size: FontSizes.LARGE_TITLE,
    color: Colors.PRIMARY_TEXT,
    textAlign: ex.TextAlign.Center,
    baseAlign: ex.BaseAlign.Middle,
  }),
  SplashSubtitleFont: new ex.Font({
    family: Fonts.GAME_FONT_FAMILY,
    size: FontSizes.SPLASH_SUBTITLE,
    color: Colors.SECONDARY_TEXT,
    textAlign: ex.TextAlign.Center,
    baseAlign: ex.BaseAlign.Middle,
  }),
};

export const UIElementStyles = {
  Button: {
    fontFamily: Fonts.UI_FONT_FAMILY,
    fontSize: `${FontSizes.BUTTON_TEXT}px`,
    backgroundColor: Colors.BUTTON_BACKGROUND_HEX,
    color: Colors.PRIMARY_TEXT.toHex(),
    border: `1px solid ${Colors.BUTTON_BORDER_HEX}`,
    borderRadius: '8px',
    padding: '0.6em 1.2em',
    cursor: 'pointer',
    display: 'block',
    tabIndex: -1,
  },
};
