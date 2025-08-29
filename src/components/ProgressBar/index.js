import { View, Text } from "react-native";
import * as Progress from "react-native-progress";
import Colors from "../../constants/Colors";

const ProgressBar = ({
  value,
  max = 1,
  label,
  height = 20,
  color = Colors.backgroundAccent,
  backgroundColor = Colors.background,
  style,
  textColor = Colors.textPrimary,
}) => {
  // coerce to safe numbers to avoid NaN transforms in native Animated views
  const safeValue =
    typeof value === "number" && !isNaN(value) ? value : Number(value) || 0;
  const safeMax =
    typeof max === "number" && !isNaN(max) && Number(max) > 0 ? Number(max) : 1;
  const progress = Math.max(0, Math.min(1, safeValue / safeMax));
  const progressText = `${Math.floor(safeValue)} / ${safeMax}`;

  return (
    <View style={[{ marginVertical: 4 }, style]}>
      {label && (
        <Text
          style={{ color: Colors.textPrimary, fontSize: 12, marginBottom: 6 }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          height: height,
          justifyContent: "center",
        }}
      >
        <Progress.Bar
          progress={progress}
          width={null}
          height={height}
          color={color}
          unfilledColor={backgroundColor}
          borderWidth={1}
          borderRadius={8}
          animated={false}
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />
        <Text
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            color: textColor,
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {progressText}
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;
