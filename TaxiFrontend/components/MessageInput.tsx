// src/components/MessageInput.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const MessageInput: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
  const [text, setText] = useState<string>('');
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);

  /* const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Разрешение необходимо',
        'Без доступа к фото нельзя прикреплять изображения.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setAttachmentUri(result.uri);
      announceForAccessibility('Изображение прикреплено');
    }
  }; */

  const handleSend = () => {
    if (text.trim() || attachmentUri) {
      // Пока что отправляем только текст (если потребуется – обработать attachmentUri отдельно)
      onSend(text.trim());
      setText('');
      setAttachmentUri(null);
    }
  };

  return (
    <View style={styles.container}>
      {attachmentUri && (
        <View style={styles.previewContainer}>
          <Text>📷 Вложение выбрано</Text>
          <TouchableOpacity
            onPress={() => {
              setAttachmentUri(null);
              // announceForAccessibility('Изображение удалено');
            }}
            accessibilityRole="button"
            accessibilityLabel="Удалить прикреплённое изображение"
            style={styles.removeImageButton}
          >
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Введите сообщение..."
          placeholderTextColor="#888888"
          multiline
          value={text}
          onChangeText={setText}
          accessible
          accessibilityLabel="Поле ввода текста сообщения"
          accessibilityHint="Введите текст и нажмите кнопку отправки"
        />

        {/* <TouchableOpacity
          onPress={pickImage}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Прикрепить изображение"
          accessibilityHint="Откроется галерея"
        >
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity> */}


        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            !(text.trim() || attachmentUri) && styles.sendButtonDisabled,
          ]}
          disabled={!(text.trim() || attachmentUri)}
          accessibilityRole="button"
          accessibilityLabel="Отправить сообщение"
          accessibilityState={{ disabled: !(text.trim() || attachmentUri) }}
        >
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  removeImageButton: {
    marginLeft: 8,
    backgroundColor: '#FFCDD2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    fontSize: 16,
    color: '#B71C1C',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
    color: '#111111',
  },
  iconButton: {
    marginLeft: 6,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  sendButton: {
    marginLeft: 6,
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#90CAF9',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default MessageInput;