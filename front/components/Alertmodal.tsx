import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BURGUNDY = '#63202C';
const CREAM    = '#F5F0E8';
const BORDER   = '#C4B89A';
const MUTED    = '#9A8E7A';
const GOLD     = '#C6A75E';

type AlertType = 'error' | 'success' | 'info';

interface AlertModalProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

const CONFIG: Record<AlertType, { emoji: string; btnColor: string }> = {
  error:   { emoji: '✕', btnColor: BURGUNDY },
  success: { emoji: '✓', btnColor: '#4A7C59' },
  info:    { emoji: 'i', btnColor: GOLD },
};

export default function AlertModal({
  visible,
  type = 'info',
  title,
  message,
  buttonText = 'Aceptar',
  onClose,
}: AlertModalProps) {
  const cfg = CONFIG[type];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.container}>
          <View style={[s.iconCircle, { backgroundColor: cfg.btnColor + '18', borderColor: cfg.btnColor + '40' }]}>
            <Text style={[s.iconText, { color: cfg.btnColor }]}>{cfg.emoji}</Text>
          </View>
          <Text style={s.title}>{title}</Text>
          <Text style={s.message}>{message}</Text>
          <TouchableOpacity style={[s.btn, { backgroundColor: cfg.btnColor }]} onPress={onClose}>
            <Text style={s.btnText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: CREAM,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 22,
    maxWidth: 340,
    width: '85%',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconText:  { fontSize: 22, fontWeight: '700' },
  title:     { fontSize: 18, fontWeight: '700', color: '#2C2A22', textAlign: 'center' },
  message:   { fontSize: 14, color: '#4A4035', lineHeight: 21, textAlign: 'center', marginBottom: 4 },
  btn: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 2,
  },
  btnText: { color: '#FFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.6 },
});
