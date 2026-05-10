import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalItems, pageSize, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const createPageButtons = () => {
    const pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      pages.push(1);
      if (start > 2) pages.push(-1);
      for (let page = start; page <= end; page += 1) pages.push(page);
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = createPageButtons();

  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        style={[styles.button, currentPage === 1 && styles.disabledButton]}
        onPress={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <Text style={[styles.buttonText, currentPage === 1 && styles.disabledText]}>Anterior</Text>
      </TouchableOpacity>

      <View style={styles.pageList}>
        {pages.map((page, index) =>
          page === -1 ? (
            <Text key={`ellipsis-${index}`} style={styles.ellipsis}>...</Text>
          ) : (
            <TouchableOpacity
              key={`page-${page}`}
              style={[styles.pageButton, page === currentPage && styles.pageButtonActive]}
              onPress={() => onPageChange(page)}
            >
              <Text style={[styles.pageText, page === currentPage && styles.pageTextActive]}>{page}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, currentPage === totalPages && styles.disabledButton]}
        onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <Text style={[styles.buttonText, currentPage === totalPages && styles.disabledText]}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 18,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#63202C',
  },
  disabledButton: {
    backgroundColor: '#D9D2C4',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  disabledText: {
    color: '#8E8E8E',
  },
  pageList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pageButton: {
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F4EEE6',
  },
  pageButtonActive: {
    backgroundColor: '#63202C',
  },
  pageText: {
    color: '#2C2A22',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  pageTextActive: {
    color: '#FFFFFF',
  },
  ellipsis: {
    color: '#2C2A22',
    fontSize: 12,
    fontWeight: '700',
  },
});
