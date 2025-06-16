// StepPurpose.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Switch } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useOrderStore } from './stores/orderStore';

const tripGoals = [
  'Медицинская организация',
  'Аэропорт, автовокзалы, железнодорожные вокзалы',
  'Место осуществления трудовой деятельности',
  'Фонд социального страхования Российской Федерации',
  'Пенсионный фонд Российской Федерации',
  'Спортивно-оздоровительная организация',
];

interface StepPurposeProps {
  styles: any;
  onBack: () => void;
  onNext: () => void;
}

export default function StepPurpose({
  styles: externalStyles,
  onBack,
  onNext,
}: StepPurposeProps) {
  const styles = { ...externalStyles, ...localStyles };
  const {
    goal,
    setGoal,
    returnPickupTime,
    setReturnPickupTime,
    showReturnPickupPicker,
    setShowReturnPickupPicker,
    needReturnPickup,
    setNeedReturnPickup,
    to,
    clearStore,
  } = useOrderStore();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showGoalError, setShowGoalError] = useState(false);

  const handleSubmit = () => {
    if (!goal) {
      setShowGoalError(true);
      Alert.alert('Ошибка', 'Пожалуйста, укажите цель поездки');
      return;
    }
    if (needReturnPickup && !returnPickupTime) {
      Alert.alert('Ошибка', 'Пожалуйста, укажите время возврата');
      return;
    }
    setShowGoalError(false);
    onNext();
    clearStore();
  };

  return (
    <View
      style={styles.panel}
      accessible={true}
      accessibilityLabel="Шаг: точка назначения, цель и детали поездки"
    >
      <View
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Точка назначения: ${to}`}
        style={{ marginBottom: 16 }}
      >
        <Text style={styles.label}>Точка назначения:</Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>{to}</Text>
      </View>

      <Text style={styles.label} accessibilityRole="header">
        Цель поездки:
      </Text>
      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Выберите цель поездки"
        accessibilityHint="Нажмите, чтобы выбрать цель поездки"
        style={[
          styles.dateTimeInput,
          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
          showGoalError && {
            borderColor: 'red',
            borderWidth: 2,
            backgroundColor: '#fff0f0',
          },
        ]}
        onPress={() => {
          setShowGoalModal(true);
          setShowGoalError(false);
        }}
      >
        <Text style={{ color: goal ? 'black' : '#999', flex: 1 }}>
          {goal || 'Выберите цель поездки'}
        </Text>
        <MaterialIcons name="chevron-right" size={24} color="#444" />
      </TouchableOpacity>
      {showGoalError && (
        <Text style={{ color: 'red', fontSize: 12, marginBottom: 4, marginLeft: 4 }}>
          Пожалуйста, выберите цель поездки
        </Text>
      )}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
          accessible={true}
          accessibilityViewIsModal={true}
          accessibilityLabel="Модальное окно выбора цели поездки"
        >
          <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 8, maxHeight: '80%' }}>
            <Text style={[styles.label, { textAlign: 'center', marginTop: 12 }]}>
              Цель поездки:
            </Text>
            <ScrollView>
              {tripGoals.map((item) => (
                <TouchableOpacity
                  key={item}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Цель поездки: ${item}`}
                  onPress={() => {
                    setGoal(item);
                    setShowGoalModal(false);
                    setShowGoalError(false);
                  }}
                  style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              onPress={() => setShowGoalModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Закрыть выбор цели поездки"
            >
              Отмена
            </Button>
          </View>
        </View>
      </Modal>

      <View
        style={[
          styles.row,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 12,
            minHeight: 40,
          },
        ]}
      >
        <Text style={[styles.label, { flex: 1, fontSize: 16, lineHeight: 22 }]} accessibilityRole="header">
          Поездка в две стороны?
        </Text>
        <View
          style={{ height: 32, justifyContent: 'center' }}
          accessible={true}
          accessibilityLabel="Поездка в две стороны"
          accessibilityRole="switch"
          accessibilityState={{ checked: needReturnPickup }}
        >
          <Switch
            value={needReturnPickup}
            onValueChange={(value) => {
              setNeedReturnPickup(value);
              if (!value) setReturnPickupTime('');
            }}
            color="#4CAF50"
            accessible={true}
            accessibilityRole="switch"
            accessibilityLabel="Двусторонняя поездка"
            accessibilityState={{ checked: needReturnPickup }}
          />
        </View>
      </View>
      {needReturnPickup && (
        <>
          <Text style={styles.label}>Когда забрать при возвращении?</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={returnPickupTime ? `Время возврата: ${returnPickupTime}` : 'Указать время возврата'}
            accessibilityHint="Нажмите, чтобы выбрать время возврата"
            style={[
              styles.dateTimeInput,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: 12,
                borderWidth: 0,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginBottom: 16,
              },
            ]}
            onPress={() => setShowReturnPickupPicker(true)}
          >
            <Text style={{ flex: 1, fontSize: 16 }}>
              {returnPickupTime ? `Время: ${returnPickupTime}` : 'Указать время'}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#444" />
          </TouchableOpacity>
          {showReturnPickupPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowReturnPickupPicker(false);
                if (selectedDate) {
                  const hours = selectedDate.getHours().toString().padStart(2, '0');
                  const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                  setReturnPickupTime(`${hours}:${minutes}`);
                }
              }}
            />
          )}
        </>
      )}

      <View style={styles.buttonRow}>
        <Button
          onPress={onBack}
          labelStyle={{ color: '#000' }}
          accessibilityRole="button"
          accessibilityLabel="Вернуться к предыдущему шагу"
        >
          Назад
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{ backgroundColor: '#4CAF50' }}
          accessibilityRole="button"
          accessibilityLabel="Перейти к следующим шагам заказа"
        >
          Далее
        </Button>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  row: {
    borderBottomWidth: 0,
  },
});