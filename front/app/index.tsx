import { Text, View, ScrollView } from "react-native";
import NavBar from "@/components/NavBar";
import Footer from "@/components/footer";
import { homeStyles } from "./index.styles"; // Importación de tus nuevos estilos

export default function Home() {
  return (
    <ScrollView style={homeStyles.container}>
      <NavBar />
      
      <View style={homeStyles.mainContent}>
        <Text style={homeStyles.title}>ESTÉTICA ALICIA</Text>
        <View style={homeStyles.divider} />
        <Text style={homeStyles.subtitle}>Tu momento de bienestar</Text>
      </View>
      
      <Footer />
    </ScrollView>
  );
}