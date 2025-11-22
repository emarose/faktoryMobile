import { CustomHeader } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import ProgressionTree from "./components/ProgressionTree/ProgressionTree";

const ProductAssemblyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Product Assembly"
        rightIcon="wrench"
        onRightIconPress={() => console.log("Assembly tools pressed")}
      />
      <ImageBackground
        source={require('../../../assets/images/backgrounds/background.png')}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.4)", "rgba(58, 2, 66, 0.6)", "rgba(0, 0, 0, 0.5)"]}
          style={styles.gradientOverlay}
        >
          <ProgressionTree />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ProductAssemblyScreen;
