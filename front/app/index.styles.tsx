import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1e8', // Fondo crema de la guía
  },
  mainContent: {
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#5a1e2a', // Borgoña para títulos
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#c6a75e', // Dorado para detalles
    marginTop: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '60%',
    backgroundColor: '#c6a75e',
    marginVertical: 20,
    opacity: 0.3,
  }
});