import * as ex from 'excalibur';
import { Colors } from '@styles/colors';

export const Fonts = {
  UI_FONT_FAMILY: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  GAME_FONT_FAMILY: 'sans-serif',
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
