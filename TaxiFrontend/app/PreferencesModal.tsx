import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Switch } from 'react-native-paper';
import { fetchUserPreferences, saveUserPreferences } from '../lib/api';

export default function PreferencesModal({ visible, onClose, onSave, initialValues }: any) {
  const [needsAssistance, setNeedsAssistance] = useState(false);
  const [hasWheelchair, setHasWheelchair] = useState(false);
  const [guideDog, setGuideDog] = useState(false);
  const [textOnly, setTextOnly] = useState(false);
  const [canHear, setCanHear] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await fetchUserPreferences();
        console.log('Загруженные предпочтения:', prefs);
        setNeedsAssistance(prefs.includes(1));
        setGuideDog(prefs.includes(2));
        setTextOnly(prefs.includes(3));
        setCanHear(prefs.includes(4));
        setHasWheelchair(prefs.includes(5));
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки предпочтений', err);
        setError('Не удалось загрузить предпочтения. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      setLoading(true);
      loadPreferences();
    }
  }, [visible]);

  const handleSave = () => {
    const preferenceIds = [];
    if (needsAssistance) preferenceIds.push(1);
    if (guideDog) preferenceIds.push(2);
    if (textOnly) preferenceIds.push(3);
    if (canHear) preferenceIds.push(4);
    if (hasWheelchair) preferenceIds.push(5);
    saveUserPreferences(preferenceIds).then(() => onSave(preferenceIds)).catch(console.error);
    onClose();
  };

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
          <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
          <Button onPress={onClose}>Закрыть</Button>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Пожелания к поездке</Text>
        <Text style={styles.description}>
          Укажите свои пожелания к поездке — они помогут водителю лучше подготовиться и сделать поездку комфортнее. 
          Эти данные сохранятся в вашем профиле и будут подставляться автоматически.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Помогите найти машину</Text>
          <Switch value={needsAssistance} onValueChange={setNeedsAssistance} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Перевозка собаки-поводыря</Text>
          <Switch value={guideDog} onValueChange={setGuideDog} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Общаюсь только текстом</Text>
          <Switch value={textOnly} onValueChange={setTextOnly} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Не говорю, но слышу</Text>
          <Switch value={canHear} onValueChange={setCanHear} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Буду с инвалидным креслом</Text>
          <Switch value={hasWheelchair} onValueChange={setHasWheelchair} />
        </View>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={[styles.button, styles.outlineButton]}
            contentStyle={{ paddingHorizontal: 16 }}
            labelStyle={{ fontSize: 16, color: '#4CAF50' }}
          >
            Отмена
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            contentStyle={{ paddingHorizontal: 16 }}
            labelStyle={{ fontSize: 16 }}
          >
            Сохранить
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
  padding: 20,
  backgroundColor: 'white',
},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 16,
    paddingRight: 10,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    marginTop: -8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    marginHorizontal: 4,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },
});