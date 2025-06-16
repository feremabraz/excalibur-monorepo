import { Colors } from '@styles/colors';
import { FontSizes, Fonts } from '@styles/text';

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
