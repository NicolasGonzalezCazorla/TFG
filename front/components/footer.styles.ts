import { StyleSheet } from 'react-native';

export const footerStyles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: '#f5f1e8',
  },
  contentRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    marginRight: 15,
  },
  mapColumn: {
    flex: 1.5,
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5a1e2a',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    color: '#5a1e2a',
    lineHeight: 18,
    marginBottom: 4,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  socialCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f5f1e8',
    borderWidth: 1,
    borderColor: '#c6a75e',
  },
  mapPlaceholder: {
    height: 100,
    backgroundColor: '#f5f1e8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c6a75e', 
  },
  mapText: {
    color: '#5a1e2a',
    fontSize: 10,
    fontWeight: '700',
  },
});