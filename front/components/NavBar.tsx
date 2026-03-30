import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CustomHeader() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerContainer}>

        <View style={styles.leftContainer}>
          <View style={styles.goldCircle} /> {/* Sustituir por <Image /> con tu logo dorado */}
          <Text style={styles.brandName}>Estética Alicia</Text>
        </View>

        {/* Navegación y Perfil */}
        <View style={styles.rightContainer}>
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.navItem}>
              <Text style={styles.navTextActive}>INICIO</Text>
              <View style={styles.activeLine} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/servicio')} style={styles.navItem}>
              <Text style={styles.navText}>SERVICIOS</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/productos')} style={styles.navItem}>
              <Text style={styles.navText}>PRODUCTOS</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/contacto')} style={styles.navItem}>
              <Text style={styles.navText}>CONTACTOS</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => router.push('/Perfil')}>
            <View style={styles.avatarPlaceholder} /> {/* Sustituir por <Image /> */}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#ffffff' },
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f1e8',
  },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  goldCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#c6a75e', marginRight: 10 },
  brandName: { fontSize: 18, fontWeight: '700', color: '#5a1e2a' },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },
  navLinks: { flexDirection: 'row', marginRight: 15 },
  navItem: { marginLeft: 20, alignItems: 'center' },
  navText: { fontSize: 12, color: '#5a1e2a', fontWeight: '400' },
  navTextActive: { fontSize: 12, color: '#5a1e2a', fontWeight: '700' },
  activeLine: { height: 2, width: '100%', backgroundColor: '#c6a75e', marginTop: 2 },
  avatarPlaceholder: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#f5f1e8', borderWidth: 1, borderColor: '#c6a75e' },
});