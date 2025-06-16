import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function CommentModal({ visible, onClose, initialComment, onSave }: {
  visible: boolean;
  onClose: () => void;
  initialComment: string;
  onSave: (comment: string) => void;
}) {
  const [comment, setComment] = useState(initialComment);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onShow={() => {
        // Delay briefly to ensure the modal has laid out its contents
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <TextInput
            ref={inputRef}
            placeholder="Комментарий для водителя"
            value={comment}
            onChangeText={setComment}
            style={styles.input}
            autoFocus
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => {
              onSave(comment);
              onClose();
            }}
          >
            Готово
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    textAlignVertical: 'center'
  },
  sheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
});