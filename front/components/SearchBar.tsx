import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder = 'Search' }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
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
