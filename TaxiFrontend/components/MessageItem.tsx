// src/components/MessageItem.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MessageDto } from '../lib/chat.service';

interface MessageItemProps {
  msg: MessageDto;
  isOwn: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, isOwn }) => {
  // Преобразуем createdAt → локальное время «12:34»
  const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const accessibilityLabel = `${msg.senderName}, ${timeString}, ${msg.text}`;

  return (
    <View
      style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}
      accessible={true}
      accessibilityRole="text"
      accessibilityState={{ selected: isOwn }}
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion="none"
    >
      <View style={styles.header}>
        <Text style={styles.senderName}>{msg.senderName}</Text>
        <Text style={styles.timestamp}>{timeString}</Text>
      </View>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={styles.text}>{msg.text}</Text>
        {msg.imageUri && (
          <Image
            source={{ uri: msg.imageUri }}
            style={styles.image}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Вложенное изображение от ${msg.senderName}`}
          />
        )}
        {msg.location && (
          <Text style={styles.locationText}>
            📍 Ш: {msg.location.lat.toFixed(5)}, Д: {msg.location.lon.toFixed(5)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
  },
  timestamp: {
    fontSize: 10,
    color: '#888888',
  },
  bubble: {
    padding: 8,
    borderRadius: 12,
  },
  ownBubble: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 0,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#111111',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginTop: 4,
  },
  locationText: {
    marginTop: 4,
    fontSize: 14,
    color: '#444444',
  },
});

export default MessageItem;