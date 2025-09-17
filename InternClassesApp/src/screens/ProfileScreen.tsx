import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const STORAGE_KEY = 'app_user';

const DEFAULT_USER: User = {
  name: 'Guest User',
  mobile: '+91-9999999999',
  credits: 8,
  city: 'Mumbai',
  joinedAt: '2025-01-01',
};

export default function ProfileScreen() {
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

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Avatar.Text
        size={80}
        label={user.name
          .split(' ')
          .map((s) => s[0])
          .join('')
          .slice(0, 2)}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text>{user.mobile}</Text>
      <Text style={styles.details}>Credits: {user.credits}</Text>
      <Text style={styles.details}>
        {user.city} • Joined {user.joinedAt}
      </Text>

      <Button
        mode="outlined"
        style={{ marginTop: 12 }}
        onPress={() => {
          setTempName(user.name);
          setModalVisible(true);
        }}
      >
        Edit Name
      </Button>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Edit Name</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={tempName}
              onChangeText={setTempName}
            />
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
  container: { flex: 1, alignItems: 'center', padding: 20 },
  name: { fontSize: 22, marginTop: 10 },
  details: { marginTop: 6 },
});
