import { Text, View, TouchableOpacity, Linking } from 'react-native';
import { footerStyles } from './footer.styles';

export default function Footer() {
  const mapUrl = "https://www.google.com/maps/place/El+Cuervo,+Sevilla/@36.853099,-6.0394187,3a,75y,157.44h,83.72t/data=!3m7!1e1!3m5!1sR8eaBMauAa14a7NWiUcsGA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D6.2836978132024655%26panoid%3DR8eaBMauAa14a7NWiUcsGA%26yaw%3D157.43949612942183!7i16384!8i8192!4m6!3m5!1s0xd0d94681945b543:0x40463fd8ca14cb0!8m2!3d36.8527976!4d-6.0385235!16s%2Fm%2F03cg2ps?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D";

  const handlePressMap = async () => {

    const supported = await Linking.canOpenURL(mapUrl);

    if (supported) {
      await Linking.openURL(mapUrl);
    } else {
      console.log("No se pudo abrir la URL: " + mapUrl);
    }
  };

  return (
    <View style={footerStyles.footerContainer}>
      <View style={footerStyles.contentRow}>
        
        <View style={footerStyles.column}>
          <Text style={footerStyles.columnTitle}>Contacto</Text>
          <Text style={footerStyles.text}>Tel: +34 698 63 39 18</Text>
          <Text style={footerStyles.text}>Mail: hola@esteticaalicia.com</Text>
        </View>

        <View style={footerStyles.column}>
          <Text style={footerStyles.columnTitle}>Horario</Text>
          <Text style={footerStyles.text}>L-V 09:30-20:30</Text>
          <View style={footerStyles.socialRow}>
            <View style={footerStyles.socialCircle} />
            <View style={footerStyles.socialCircle} />
          </View>
        </View>

        <View style={footerStyles.mapColumn}>
          <Text style={footerStyles.columnTitle}>Ubicación</Text>
          <TouchableOpacity 
            style={footerStyles.mapPlaceholder} 
            onPress={handlePressMap}
            activeOpacity={0.7}
          >
             <Text style={footerStyles.mapText}>📍 VER MAPA</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}