import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const STORAGE_KEY = 'app_user';

const DEFAULT_USER: User = {
  name: 'Guest User',
  mobile: '+91-9999999999',
  credits: 50,
  city: 'Mumbai',
  joinedAt: '2025-01-01',
};

export default function HomeHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUser(JSON.parse(raw));
        } else {
          setUser(DEFAULT_USER);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
        }
      } catch {
        setUser(DEFAULT_USER);
      }
    })();
  }, []);

  const saveName = async () => {
    if (!user) return;
    const updatedUser = { ...user, name: tempName || user.name };
    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setModalVisible(false);
  };

  const avatarLabel = user
    ? user.name
        .split(' ')
        .map((s) => s[0])
        .join('')
        .slice(0, 2)
    : '?';

  return (
    <View style={styles.header}>
      <Text style={styles.homeText}>Browse Classes</Text>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Avatar.Text size={40} label={avatarLabel} style={{ backgroundColor: '#6200ee' }} />
      </TouchableOpacity>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Edit Name</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={tempName}
              onChangeText={setTempName}
              placeholder={user?.name}
            />
            <Text style={{ marginTop: 8 }}>Mobile: {user?.mobile}</Text>
            <Text>Credits: {user?.credits}</Text>
            <Text>
              {user?.city} • Joined {user?.joinedAt}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            <Button onPress={saveName}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
  },
  homeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
