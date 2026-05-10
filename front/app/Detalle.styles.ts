import { StyleSheet } from 'react-native';

export const detalleStyles = StyleSheet.create({

  // ── Layout base ───────────────────────────
  screen: {
    flex: 1,
    backgroundColor: '#F9F8F4',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  containerDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 48,
  },

  // ── Título de página ──────────────────────
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 28,
    letterSpacing: 0.5,
  },

  // ── Layout principal dos columnas ─────────
  mainLayout: {
    flexDirection: 'column',
    gap: 24,
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 48,
  },

  // ── Columna izquierda ─────────────────────
  leftCol: {
    width: '100%',
  },
  leftColDesktop: {
    flex: 1,
  },

  // ── Columna derecha ───────────────────────
  rightCol: {
    width: '100%',
  },
  rightColDesktop: {
    flex: 1,
  },

  // ── Imagen experiencia ────────────────────
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#EDE8E0',
  },
  buttonWrapper: {
    alignItems: 'flex-end',
    marginTop: 16,
  },

  // ── Imagen producto ───────────────────────
  productImage: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    backgroundColor: '#EDE8E0',
  },

  // ── Texto ─────────────────────────────────
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  bodyText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },

  // ── Bullets ───────────────────────────────
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#63202C',
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
    flex: 1,
  },

  // ── Acciones producto ─────────────────────
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    gap: 16,
  },
  priceTag: {
    borderWidth: 1,
    borderColor: '#D4C2AD',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
});
