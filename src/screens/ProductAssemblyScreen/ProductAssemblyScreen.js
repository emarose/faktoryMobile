import { CustomHeader } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <ProgressionTree />
    </SafeAreaView>
  );
};

export default ProductAssemblyScreen;
