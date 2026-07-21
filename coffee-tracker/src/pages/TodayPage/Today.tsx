import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { getTime } from "../../utils/getTime";
import { s, vs } from "react-native-size-matters";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Oswald_700Bold } from "@expo-google-fonts/oswald";
import Toast from "react-native-toast-message";

const SCREEN_WIDTH = Dimensions.get("screen").width;

type list = {
  id: number;
  name: string;
  value: number;
};

const Today = () => {
  const [caffeineValue, setCaffeineValue] = useState<number>(0);
  const [latte, setLatte] = useState<number>(80);
  const [filtre, setFiltre] = useState<number>(140);
  const [americano, setAmericano] = useState<number>(120);
  const [maxValue, setMaxValue] = useState<number>(400);
  const [modulOpen, setModulOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>("");
  const [customCaffeinValue, setCustomCaffeinValue] = useState<number>(0);
  const [customCaffeinList, setCustomCaffeinList] = useState<list[]>([]);
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
      <ScrollView>
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
          {/* Buttons */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignSelf: "flex-end",
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => setCaffeineValue(0)}
            >
              <Text style={styles.cardText}>Sıfırla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => setModulOpen(true)}
            >
              <Text style={styles.cardText}>Ekle</Text>
            </TouchableOpacity>
          </View>
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
        {/* Today's history */}
        <View style={styles.todaysMainContainer}>
          <View style={styles.todaysContainer}>
            <Text style={styles.fastAddTitle}>Bugün içilenler</Text>
            <MaterialIcons
              name="today"
              size={25}
              color="white"
              style={{ paddingTop: 10 }}
            />
          </View>
          {customCaffeinList.length > 0 &&
            customCaffeinList.map((item) => (
              <View style={styles.fastAddCard}>
                <Text style={{ color: "#fff" }}>
                  {item.name} ({item.value} mg)
                </Text>
              </View>
            ))}
          {customCaffeinList.length <= 0 && (
            <View
              style={{
                width: SCREEN_WIDTH,
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="emoji-sad" size={50} color="white" />
              <Text style={styles.mgStyle}>Henüz kafein eklemedin</Text>
            </View>
          )}
        </View>
        <Toast />
      </ScrollView>

      {/* Custom Coffein */}
      <Modal visible={modulOpen} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modulContainer}>
          <View
            style={{
              width: SCREEN_WIDTH,
            }}
          >
            <TouchableOpacity onPress={() => setModulOpen(false)}>
              <FontAwesome
                name="close"
                color="white"
                style={{
                  ...styles.cardText,
                  alignSelf: "flex-end",
                  marginRight: 20,
                  fontSize: 25,
                }}
              />
            </TouchableOpacity>
            <Text style={{ ...styles.fastAddTitle }}>
              Ne Kadar Kafein Aldın?
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Ad"
            onChangeText={(text) => setCustomName(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Kafein Miktar (mg)"
            onChangeText={(text) => setCustomCaffeinValue(Number(text))}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setCustomCaffeinList((prev) => [
                ...prev,
                {
                  id: Math.random(),
                  name: customName,
                  value: customCaffeinValue,
                },
              ]);
              setModulOpen(false);
              setCaffeineValue((prev) => prev + customCaffeinValue);
            }}
          >
            <Text style={styles.cardText}>Ekle</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
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
    top: 0,
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
    height: vs(250),
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
  todaysMainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    gap: 10,
  },
  todaysContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  modulContainer: {
    flex: 1,
    backgroundColor: "#12100E",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 15,
    padding: 10,
  },
  textInput: {
    width: vs(280),
    height: 50,
    borderColor: "#fff",
    borderRadius: 10,
    backgroundColor: "white",
    color: "#908989",
    fontSize: 15,
    fontFamily: "Oswald_700Bold",
  },
  todaysCard: {},
});

export default Today;
