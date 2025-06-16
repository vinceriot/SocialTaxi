// Step3Confirmation.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useOrderStore } from './stores/orderStore';

export default function Step3Confirmation({ styles: externalStyles }: { styles: any }) {
  const styles = { ...externalStyles, ...localStyles };

  const {
    from,
    date,
    setDate,
    time,
    setTime,
    setStep,
  } = useOrderStore();

  // Локальное состояние для управления видимостью пикеров
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Всегда сначала скрываем пикер
    setShowPicker(null);
    
    if (event.type === 'set' && selectedDate) {
      const d = selectedDate.toISOString().split('T')[0];
      setDate(d);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    // Всегда сначала скрываем пикер
    setShowPicker(null);
    
    if (event.type === 'set' && selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.label}>Точка отправления:</Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>{from}</Text>

      <Text style={styles.label}>Выберите дату и время поездки:</Text>

      <TouchableOpacity
        onPress={() => setShowPicker('date')}
        style={[
          localStyles.row,
          {
            marginTop: 12,
            backgroundColor: '#f0f0f0',
            borderRadius: 12,
            borderBottomWidth: 0,
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
        ]}
      >
        <Text style={localStyles.fieldLabel}>Дата: {date}</Text>
        <MaterialIcons name="chevron-right" size={24} color="#444" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowPicker('time')}
        style={[
          localStyles.row,
          {
            marginTop: 12,
            backgroundColor: '#f0f0f0',
            borderRadius: 12,
            borderBottomWidth: 0,
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
        ]}
      >
        <Text style={localStyles.fieldLabel}>Время: {time}</Text>
        <MaterialIcons name="chevron-right" size={24} color="#444" />
      </TouchableOpacity>

      {showPicker === 'date' && (
        <DateTimePicker
          key="date-picker" // Ключ для предотвращения повторного монтирования
          value={new Date(`${date}T${time}`)}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {showPicker === 'time' && (
        <DateTimePicker
          key="time-picker" // Ключ для предотвращения повторного монтирования
          value={new Date(`${date}T${time}`)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.buttonRow}>
        <Button onPress={() => setStep(2)} labelStyle={{ color: '#000' }}>Назад</Button>
        <Button
          mode="contained"
          onPress={() => setStep(4)}
          style={{ backgroundColor: '#4CAF50' }}
        >
          Далее
        </Button>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    flex: 1,
  },
});