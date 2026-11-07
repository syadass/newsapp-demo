import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LocalStorage from 'react-native-local-storage';

const DemoStorage = () => {
  const [inputValue, setInputValue] = useState('');
  const [storedItems, setStoredItems] = useState([]);

  // Load items from local storage on mount
  useEffect(() => {
    LocalStorage.getAllItems((err, items) => {
      if (err) console.error('Error loading from localStorage:', err);
      else if (items && items.length > 0) {
        // Get items from localStorage; each item is stored as a key-value pair
        const keys = Object.keys(items);
        const loadedItems = keys
          .filter((key) => key !== '_uid' && !key.startsWith('_'))
          .map((key) => items[key])
          .filter((item) => item !== null && item !== undefined);
        setStoredItems(loadedItems);
      }
    });
  }, []);

  // Save item to local storage
  const handleSave = () => {
    if (inputValue.trim() === '') {
      Alert.alert('Input Kosong', 'Silakan masukkan nilai terlebih dahulu');
      return;
    }

    LocalStorage.setItem(inputValue, inputValue, (err, key) => {
      if (err) console.error('Error saving to localStorage:', err);
      else {
        // Refresh the list after saving
        LocalStorage.getAllItems((err2, items) => {
          if (err2) console.error('Error reloading:', err2);
          else {
            const keys = Object.keys(items).filter(
              (key) => key !== '_uid' && !key.startsWith('_')
            );
            const newItems = keys
              .map((key) => items[key])
              .filter((item) => item !== null && item !== undefined);
            setStoredItems(newItems);
          }
        });
        setInputValue('');
      }
    });
  };

  // Remove item from local storage
  const handleRemove = (key) => {
    LocalStorage.removeItem(key, (err) => {
      if (err) console.error('Error removing:', err);
      else {
        LocalStorage.getAllItems((err2, items) => {
          if (err2) console.error('Error reloading:', err2);
          else {
            const keys = Object.keys(items).filter(
              (key) => key !== '_uid' && !key.startsWith('_')
            );
            const newItems = keys
              .map((key) => items[key])
              .filter((item) => item !== null && item !== undefined);
            setStoredItems(newItems);
          }
        });
      }
    });
  };

  // Clear all data from local storage
  const handleReset = () => {
    LocalStorage.clear((err) => {
      if (err) console.error('Error clearing localStorage:', err);
      else {
        setStoredItems([]);
        Alert.alert('Berhasil', 'Semua data telah direset');
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Demo Local Storage</Text>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nilai..."
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {storedItems.length > 0 ? (
        <View style={styles.listSection}>
          <Text style={styles.listText}>Data yang Tersimpan:</Text>
          <FlatList
            data={storedItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item)}
                >
                  <Text style={styles.removeButtonText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>Belum ada data yang tersimpan</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3A8FB7',
  },
  inputSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  saveButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#3A8FB7',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f44336',
    borderRadius: 8,
    marginLeft: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listSection: {
    marginTop: 20,
  },
  listText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  removeButton: {
    padding: 4,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#f44336',
    fontSize: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DemoStorage;