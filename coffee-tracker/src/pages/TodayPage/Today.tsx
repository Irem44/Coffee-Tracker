import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { getTime } from "../../utils/getTime";
import { s, vs } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Oswald_700Bold } from "@expo-google-fonts/oswald";
import Toast from "react-native-toast-message";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const Today = () => {
  const [caffeineValue, setCaffeineValue] = useState<number>(0);
  const [latte, setLatte] = useState<number>(80);
  const [filtre, setFiltre] = useState<number>(140);
  const [americano, setAmericano] = useState<number>(120);
  const [maxValue, setMaxValue] = useState<number>(400);
  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
  });
  useEffect(() => {
    if (caffeineValue > 400) {
      Toast.show({
        type: "error",
        text1: "Yüksek Kafein Uyarısı! ⚠️",
        text2: `Günlük güvenli sınırı aştınız (${caffeineValue} mg).`,
        position: "top",
        visibilityTime: 1000,
        autoHide: true,
      });
    }
  }, [caffeineValue]);

  // Fontlar yüklenene kadar boş ekran veya yükleniyor ikonu gösteriyoruz
  if (!fontsLoaded) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#D4A373" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleStyle}>{getTime()}</Text>
      {/* Circuller Progress */}
      <View style={styles.circularProgressStyle}>
        <CircularProgress
          value={caffeineValue ? caffeineValue : 0}
          maxValue={maxValue}
          radius={110}
          duration={1000}
          progressValueColor={"#F4EFEA"} // İçerideki rakamın rengi (Krem)
          activeStrokeColor={`${caffeineValue > 400 ? "#b81212" : "#D4A373"}`} // Dolan çizginin rengi (Karamel)
          inActiveStrokeColor={"#c4b0a3"} // Arkadaki boş çizginin rengi (Koyu kahve)
          activeStrokeWidth={18}
          inActiveStrokeWidth={12}
          title={"mg"}
          titleColor={"#c4b0a3"}
          titleStyle={{ fontWeight: "bold", fontSize: 16 }}
          valueSuffix={""}
        />
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setCaffeineValue(0)}
        >
          <Text style={styles.cardText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>
      {/* Fast Add */}
      <View style={styles.fastAddContainer}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.fastAddTitle}>Hızlı Ekle</Text>
          <MaterialIcons
            name="free-breakfast"
            size={25}
            color="white"
            style={{ marginLeft: 8, paddingTop: 6 }}
          />
        </View>
        {/* Latte Field */}
        <TouchableOpacity
          style={styles.fastAddCard}
          onPress={() => setCaffeineValue((prev: any) => prev + latte)}
        >
          <Text style={styles.cardText}>Latte</Text>
          <Text style={styles.mgStyle}>{`(${latte} mg)`}</Text>
        </TouchableOpacity>
        {/* Filtre Field */}
        <TouchableOpacity
          style={styles.fastAddCard}
          onPress={() => setCaffeineValue((prev: any) => prev + filtre)}
        >
          <Text style={styles.cardText}>Filtre</Text>
          <Text style={styles.mgStyle}>{`(${filtre} mg)`}</Text>
        </TouchableOpacity>
        {/* Americano Field */}
        <TouchableOpacity
          style={styles.fastAddCard}
          onPress={() => setCaffeineValue((prev: any) => prev + americano)}
        >
          <Text style={styles.cardText}>Americano</Text>
          <Text style={styles.mgStyle}>{`(${americano} mg)`}</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12100E",
  },
  titleStyle: {
    color: "#fff",
    position: "absolute",
    top: 30,
    left: 10,
    fontSize: 25,
    fontFamily: "Oswald_700Bold",
    textShadowColor: "#D4A373",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    width: SCREEN_WIDTH,
    height: 50,
  },
  fastAddContainer: {
    width: SCREEN_WIDTH,
    height: vs(300),
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 20,
    marginLeft: 20,
  },
  fastAddCard: {
    width: 350,
    height: 50,
    borderWidth: 1,
    borderColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  cardText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Oswald_700Bold",
  },
  fastAddTitle: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Oswald_700Bold",
  },
  circularProgressStyle: {
    width: SCREEN_WIDTH,
    height: vs(250),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  mgStyle: {
    color: "#fff",
    fontSize: 15,
    marginTop: 8,
  },
  resetButton: {
    width: 80,
    height: 50,
    backgroundColor: "#000000",
    alignSelf: "flex-end",
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Today;
