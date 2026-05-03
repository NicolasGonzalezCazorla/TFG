import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({

  // ── Layout base ───────────────────────────
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentDesktop: {
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flex: 1,
  },
  containerDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
  },

  // ── Sección genérica ──────────────────────
  section: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },

  // ── Hero Desktop ──────────────────────────
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4C2AD',
  },
  heroLeft: {
    flex: 1,
    paddingRight: 40,
  },
  heroEyebrow: {
    fontSize: 12,
    color: '#777777',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#63202C',
    textTransform: 'uppercase',
    letterSpacing: 2,
    lineHeight: 42,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#777777',
    lineHeight: 24,
    marginBottom: 8,
  },
  heroRight: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 340,
    borderRadius: 16,
  },

  // ── Hero Mobile ───────────────────────────
  heroMobile: {
    backgroundColor: '#FFFFFF',
  },
  heroImageMobile: {
    width: '100%',
    height: 220,
  },
  heroMobileContent: {
    padding: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },

  // ── Experiencias ──────────────────────────
  experienceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  experienceList: {
    marginTop: 8,
  },

  // ── Productos – Banner ────────────────────
  productBanner: {
    backgroundColor: '#EDE8E0',
    borderRadius: 10,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  productBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  productBannerSub: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
  },

  // ── Productos – Filtros Mobile ────────────
  mobileFilters: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },

  // ── Productos – Grid ──────────────────────
  productGrid: {
    width: '100%',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
