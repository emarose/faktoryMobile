import { Text as RNText } from 'react-native';

const Text = ({ style, children, ...props }) => {
  const getFontFamily = (combinedStyle) => {
    const flatStyle = Array.isArray(combinedStyle) 
      ? Object.assign({}, ...combinedStyle) 
      : combinedStyle || {};
    
    const isBold = flatStyle.fontWeight === 'bold' || flatStyle.fontWeight === '700'| flatStyle.fontWeight === '600';
    const isItalic = flatStyle.fontStyle === 'italic';
    
    if (isBold && isItalic) {
      return 'SpaceMono-BoldItalic';
    } else if (isBold) {
      return 'SpaceMono-Bold';
    } else if (isItalic) {
      return 'SpaceMono-Italic';
    } else {
      return 'SpaceMono-Regular';
    }
  };
  
  const combinedStyle = [style];
  const fontFamily = getFontFamily(combinedStyle);
  
  const finalStyle = [
    { fontFamily },
    style,
    { fontWeight: undefined }
  ];

  return (
    <RNText style={finalStyle} {...props}>
      {children}
    </RNText>
  );
};

export default Text;