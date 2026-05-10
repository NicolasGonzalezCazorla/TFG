import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder = 'Search' }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={18} color="#AAAAAA" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#AAAAAA"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4C2AD',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
    color: '#AAAAAA',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    padding: 0,
  },
});

export default SearchBar;
