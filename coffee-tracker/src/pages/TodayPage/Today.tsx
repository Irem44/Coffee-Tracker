import React from "react";
import { View, StyleSheet, Text } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { getTime } from "../../utils/getTime";
import { s } from "react-native-size-matters";

const Today = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>{getTime()}</Text>
      {/* Circuller Progress */}
      <View>
        <CircularProgress
          value={800}
          maxValue={1000}
          radius={110}
          duration={1000}
          progressValueColor={"#F4EFEA"} // İçerideki rakamın rengi (Krem)
          activeStrokeColor={"#D4A373"} // Dolan çizginin rengi (Karamel)
          inActiveStrokeColor={"#c4b0a3"} // Arkadaki boş çizginin rengi (Koyu kahve)
          activeStrokeWidth={18}
          inActiveStrokeWidth={12}
          title={"mg"}
          titleColor={"#c4b0a3"}
          titleStyle={{ fontWeight: "bold", fontSize: 16 }}
          valueSuffix={""}
        />
      </View>
      {/* Fast Add */}
      <View style={styles.fastAddContainer}>
        {/* Latte Field */}
        <View style={styles.fastAddCard}>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
            }}
          >
            Latte
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12100E",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  titleStyle: {
    color: "#fff",
    position: "absolute",
    top: 30,
    left: 30,
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    textShadowColor: "#D4A373",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    width: s(150),
  },
  fastAddContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  fastAddCard: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Today;
