import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { YogaClass } from '../types';

type Props = {
  item: YogaClass;
  booked: boolean;
  onBook: () => void;
};

export default function ClassCard({ item, booked, onBook }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        subtitle={`${item.level} • ${item.instructor} • ${item.center}`}
      />
      <Card.Content>
        <Text>Level: {item.level}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          disabled={booked}
          onPress={onBook}
        >
          {booked ? 'Booked' : 'Quick Book'}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { margin: 8 },
});
