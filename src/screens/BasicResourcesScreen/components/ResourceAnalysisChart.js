import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const ResourceAnalysisChart = ({ data, label }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noData}>No data available</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.yAxisLabelWrapper}>
          <Text style={styles.yAxisLabel}>Cantidad</Text>
        </View>
        <View style={{flex: 1}}>
          <LineChart
            data={{
              labels: data.map((_, i) => `${i + 1}`),
              datasets: [
                {
                  data: data,
                },
              ],
            }}
            width={300}
            height={180}
            chartConfig={{
              backgroundColor: "#222",
              backgroundGradientFrom: "#222",
              backgroundGradientTo: "#333",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
          <Text style={styles.xAxisLabel}>Tiempo</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  yAxisLabelWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    height: 180,
    width: 32,
  },
  chart: {
    borderRadius: 12,
  },
  noData: {
    color: "#aaa",
    fontStyle: "italic",
    marginTop: 24,
  },
  yAxisLabel: {
    color: "#fff",
    fontSize: 12,
    fontStyle: "italic",
    transform: [{ rotate: "-90deg" }],
    width: 60,
    textAlign: "center",
  },
  xAxisLabel: {
    color: "#fff",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
});

export default ResourceAnalysisChart;
