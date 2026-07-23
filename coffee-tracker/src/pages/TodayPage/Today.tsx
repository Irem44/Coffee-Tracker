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
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { getTime } from "../../utils/getTime";
import {
  MaterialIcons,
  Entypo,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Oswald_700Bold } from "@expo-google-fonts/oswald";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("screen").width;

//There should be a key to keep the list
//*Keys are outside the component because I don't want components to re-render when anything changes

const STORAGE_KEY_LIST = "@caffeine_list";
const STORAGE_KEY_DATE = "@caffeine_last_date";

type DrinkItem = {
  id: string;
  name: string;
  value: number;
};

const Today = () => {
  const [caffeineValue, setCaffeineValue] = useState<number>(0);
  const [waterValue, setWaterValue] = useState<number>(0);
  const [latte] = useState<number>(80);
  const [filtre] = useState<number>(140);
  const [americano] = useState<number>(120);
  const [maxValue] = useState<number>(400);
  const [maxWaterValue, setMaxWaterValue] = useState<number>(5000);
  const [modulOpen, setModulOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>("");
  const [customCaffeinValue, setCustomCaffeinValue] = useState<string>("");
  const [customCaffeinList, setCustomCaffeinList] = useState<DrinkItem[]>([]);
  const [loadedData, setLoadedData] = useState<boolean>(false);
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
        visibilityTime: 2500,
        autoHide: true,
      });
    }
  }, [caffeineValue]);

  useEffect(() => {
    if (loadedData) {
      saveData();
    }
  }, [customCaffeinList, loadedData]);

  useEffect(() => {
    loadData();
  }, []);

  // Add Custom Drink
  const handleAddDrink = (name: string, value: number) => {
    const newItem: DrinkItem = {
      id: Date.now().toString() + Math.random().toString(),
      name,
      value,
    };
    setCustomCaffeinList((prev) => [newItem, ...prev]);
    setCaffeineValue((prev) => prev + value);
  };

  // Remove Drink
  const handleDeleteDrink = (id: string, value: number) => {
    setCustomCaffeinList((prev) => prev.filter((item) => item.id !== id));
    setCaffeineValue((prev) => Math.max(0, prev - value));
  };

  const handleCustomAdd = () => {
    const numericValue = Number(customCaffeinValue);
    if (!customName.trim() || isNaN(numericValue) || numericValue <= 0) {
      Toast.show({
        type: "error",
        text1: "Eksik Bilgi",
        text2: "Lütfen geçerli bir isim ve mg miktarı girin.",
        position: "bottom",
      });
      return;
    }

    handleAddDrink(customName.trim(), numericValue);
    setCustomName("");
    setCustomCaffeinValue("");
    setModulOpen(false);
  };

  const saveData = async () => {
    try {
      const todayDate = new Date().toISOString().split("T")[0];
      const stringList = JSON.stringify(customCaffeinList);

      await AsyncStorage.setItem(STORAGE_KEY_LIST, stringList);
      await AsyncStorage.setItem(STORAGE_KEY_DATE, todayDate);
    } catch (error) {
      console.error("Submit error", error);
    }
  };
  const loadData = async () => {
    try {
      const storedList = await AsyncStorage.getItem(STORAGE_KEY_LIST);
      const storedDate = await AsyncStorage.getItem(STORAGE_KEY_DATE);
      const todayDate = new Date().toISOString().split("T")[0];

      if (storedDate !== todayDate) {
        await AsyncStorage.multiRemove([STORAGE_KEY_LIST, STORAGE_KEY_DATE]);
        setCustomCaffeinList([]);
        setCaffeineValue(0);
      } else if (storedList) {
        const parsedList: DrinkItem[] = JSON.parse(storedList);
        setCustomCaffeinList(parsedList);
        const total = parsedList.reduce((sum, item) => sum + item.value, 0);
        setCaffeineValue(total);
      }
    } catch (error) {
      console.error("Data loading error", error);
    } finally {
      setLoadedData(true);
    }
  };
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#D4A373" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.titleStyle}>{getTime()}</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 15,
            padding: 20,
          }}
        >
          {/* Circular Progress Container*/}
          <View style={styles.circularProgressStyle}>
            <CircularProgress
              value={caffeineValue}
              maxValue={maxValue}
              radius={80}
              duration={800}
              progressValueColor={"#F4EFEA"}
              activeStrokeColor={caffeineValue > 400 ? "#E63946" : "#D4A373"}
              inActiveStrokeColor={"#7d6f67"}
              activeStrokeWidth={16}
              inActiveStrokeWidth={12}
              title={"mg"}
              titleColor={"#A0958E"}
              titleStyle={{ fontWeight: "600", fontSize: 15 }}
            />

            {/* Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setCaffeineValue(0);
                  setCustomCaffeinList([]);
                }}
              >
                <Text style={styles.resetButtonText}>Sıfırla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setModulOpen(true)}
              >
                <Text style={styles.primaryButtonText}>+ Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Circular Progress Container (Water)*/}
          <View style={styles.circularProgressStyle}>
            <CircularProgress
              value={waterValue}
              maxValue={maxWaterValue}
              radius={80}
              duration={800}
              progressValueColor={"#F4EFEA"}
              activeStrokeColor={"#38bdf8"}
              inActiveStrokeColor={"#e0f2fe"}
              activeStrokeWidth={16}
              inActiveStrokeWidth={12}
              title={"💧 (200ml)"}
              titleColor={"#F4EFEA"}
              titleStyle={{ fontSize: 15 }}
            />

            {/* Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setWaterValue(0);
                }}
              >
                <Text style={styles.resetButtonText}>Sıfırla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setWaterValue((prev: any) => prev + 200);
                }}
              >
                <Text style={styles.primaryButtonText}>+ Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Fast Add Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hızlı Ekle</Text>
            <MaterialIcons name="free-breakfast" size={22} color="#D4A373" />
          </View>

          <TouchableOpacity
            style={styles.fastAddCard}
            onPress={() => handleAddDrink("Latte", latte)}
          >
            <Text style={styles.cardTitle}>Latte</Text>
            <Text style={styles.cardSubtitle}>{`(${latte} mg)`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fastAddCard}
            onPress={() => handleAddDrink("Filtre Kahve", filtre)}
          >
            <Text style={styles.cardTitle}>Filtre Kahve</Text>
            <Text style={styles.cardSubtitle}>{`(${filtre} mg)`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fastAddCard}
            onPress={() => handleAddDrink("Americano", americano)}
          >
            <Text style={styles.cardTitle}>Americano</Text>
            <Text style={styles.cardSubtitle}>{`(${americano} mg)`}</Text>
          </TouchableOpacity>
        </View>

        {/* Today's History Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bugün İçilenler</Text>
            <MaterialIcons
              name="today"
              size={22}
              color="#D4A373"
              style={{ marginTop: 8 }}
            />
          </View>

          {customCaffeinList.length > 0 ? (
            customCaffeinList.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyName}>{item.name}</Text>
                  <Text style={styles.historyValue}>{item.value} mg</Text>
                </View>

                {/* Kart İçi Aksiyonlar: Ekle & Sil */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={() =>
                      setCaffeineValue((prev) => prev + item.value)
                    }
                  >
                    <Ionicons name="add" size={16} color="#D4A373" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteDrink(item.id, item.value)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#E63946" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Entypo name="emoji-sad" size={40} color="#4A423D" />
              <Text style={styles.emptyText}>Henüz kafein eklemedin</Text>
            </View>
          )}
        </View>

        <Toast />
      </ScrollView>

      {/* Add Custom Caffeine Modal */}
      <Modal visible={modulOpen} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modulContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ne Kadar Kafein Aldın?</Text>
            <TouchableOpacity onPress={() => setModulOpen(false)}>
              <FontAwesome name="close" color="#A0958E" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <TextInput
              style={styles.textInput}
              placeholder="İçecek Adı (ör: Espresso)"
              placeholderTextColor="#665E58"
              value={customName}
              onChangeText={setCustomName}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Kafein Miktarı (mg)"
              placeholderTextColor="#665E58"
              value={customCaffeinValue}
              onChangeText={setCustomCaffeinValue}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalSubmitButton]}
              onPress={handleCustomAdd}
            >
              <Text style={styles.primaryButtonText}>Listeye Ekle</Text>
            </TouchableOpacity>
          </View>
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
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    color: "#F4EFEA",
    fontSize: 24,
    fontFamily: "Oswald_700Bold",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  circularProgressStyle: {},
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A332E",
    backgroundColor: "#1A1715",
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#A0958E",
    fontSize: 15,
    fontWeight: "600",
  },
  primaryButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#D4A373",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#12100E",
    fontSize: 15,
    fontWeight: "700",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    color: "#F4EFEA",
    fontSize: 20,
    fontFamily: "Oswald_700Bold",
  },
  fastAddCard: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#2A2421",
    backgroundColor: "#1A1715",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  cardTitle: {
    color: "#F4EFEA",
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#A0958E",
    fontSize: 14,
  },
  historyCard: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderColor: "#2A2421",
    backgroundColor: "#1A1715",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  historyName: {
    color: "#F4EFEA",
    fontSize: 15,
    fontWeight: "600",
  },
  historyValue: {
    color: "#D4A373",
    fontSize: 13,
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(212, 163, 115, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.3)",
  },
  addMoreText: {
    color: "#D4A373",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: "rgba(230, 57, 70, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.25)",
  },
  emptyContainer: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    color: "#665E58",
    fontSize: 14,
  },
  modulContainer: {
    flex: 1,
    backgroundColor: "#12100E",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  modalTitle: {
    color: "#F4EFEA",
    fontSize: 22,
    fontFamily: "Oswald_700Bold",
  },
  modalBody: {
    gap: 16,
  },
  textInput: {
    width: "100%",
    height: 54,
    borderColor: "#2A2421",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#1A1715",
    color: "#F4EFEA",
    paddingHorizontal: 16,
    fontSize: 15,
  },
  modalSubmitButton: {
    height: 54,
    marginTop: 10,
  },
});

export default Today;
