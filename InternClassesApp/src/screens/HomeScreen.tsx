import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Chip, Button, Menu, Snackbar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { CLASSES } from '../data/classes';
import ClassCard from '../components/ClassCard';
import HomeHeader from '../components/HomeHeader';

/* ----------------- TYPE DEFINITIONS ----------------- */
type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;
type Props = { navigation: HomeNavProp };
/* ---------------------------------------------------- */

export default function HomeScreen({ navigation }: Props) {
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const instructors = Array.from(new Set(CLASSES.map((c) => c.instructor)));

  /* ------------------ LEVEL FILTER ------------------ */
  const toggleLevel = (level: string) => {
    const newSet = new Set(selectedLevels);
    newSet.has(level) ? newSet.delete(level) : newSet.add(level);
    setSelectedLevels(newSet);
  };

  const clearFilters = () => {
    setSelectedLevels(new Set());
    setSelectedInstructor(null);
  };

  const filtered = CLASSES.filter((c) => {
    const levelOk = selectedLevels.size === 0 || selectedLevels.has(c.level);
    const instructorOk = !selectedInstructor || c.instructor === selectedInstructor;
    return levelOk && instructorOk;
  });

  /* ------------------ BOOKING WITH 15% FAILURE ------------------ */
  const bookClass = (id: string) => {
    const previousBooked = new Set(bookedIds); // Save current state
    const newBooked = new Set([...bookedIds, id]);
    setBookedIds(newBooked); // Optimistic update

    // 15% chance to fail
    if (Math.random() < 0.15) {
      setBookedIds(previousBooked); // Rollback
      setSnackbarMsg('Failed to book class. Please try again.');
      setSnackbarVisible(true);
      return;
    }

    setSnackbarMsg('Class booked successfully!');
    setSnackbarVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <HomeHeader />

      {/* Filters */}
      <View style={{ flexDirection: 'row', padding: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip
          selected={selectedLevels.has('Beginner')}
          onPress={() => toggleLevel('Beginner')}
          style={{ marginRight: 8 }}
        >
          Beginner
        </Chip>
        <Chip
          selected={selectedLevels.has('Intermediate')}
          onPress={() => toggleLevel('Intermediate')}
          style={{ marginRight: 8 }}
        >
          Intermediate
        </Chip>
        <Chip
          selected={selectedLevels.has('Advanced')}
          onPress={() => toggleLevel('Advanced')}
          style={{ marginRight: 8 }}
        >
          Advanced
        </Chip>

        {/* Instructor Dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)}>
              {selectedInstructor ?? 'Instructor'}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setSelectedInstructor(null);
              setMenuVisible(false);
            }}
            title="All"
          />
          {instructors.map((i) => (
            <Menu.Item
              key={i}
              onPress={() => {
                setSelectedInstructor(i);
                setMenuVisible(false);
              }}
              title={i}
            />
          ))}
        </Menu>

        <Button onPress={clearFilters} compact style={{ marginLeft: 'auto' }}>
          Clear
        </Button>
      </View>

      {/* Classes List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClassCard
            item={item}
            booked={bookedIds.has(item.id)}
            onBook={() => bookClass(item.id)}
          />
        )}
      />

      {/* Snackbar for success/failure */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarMsg.includes('Failed') ? 'red' : 'green' }}
      >
        {snackbarMsg}
      </Snackbar>
    </View>
  );
}
