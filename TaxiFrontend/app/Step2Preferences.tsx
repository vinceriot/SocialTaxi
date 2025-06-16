// Step2Preferences.tsx
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, TextInput as RNTextInput, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Switch } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CommentModal from './CommentModal';
import { useOrderStore } from './stores/orderStore';

export default function Step2Preferences({ styles: externalStyles }: { styles: any }) {
  const styles = { ...externalStyles, ...localStyles };
  const commentInputRef = useRef<RNTextInput>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const {
    needsAssistance,
    setNeedsAssistance,
    hasWheelchair,
    setHasWheelchair,
    guideDog,
    setGuideDog,
    textOnly,
    setTextOnly,
    canHear,
    setCanHear,
    comment,
    setComment,
    setStep,
  } = useOrderStore();

  useEffect(() => {
    if (needsAssistance && commentInputRef.current) {
      commentInputRef.current.focus();
      AccessibilityInfo.announceForAccessibility('Пожалуйста, опишите как вы выглядите в комментарии к поездке');
    }
  }, [needsAssistance]);

  const handleSwitchChange = (value: boolean, setter: (val: boolean) => void, label: string) => {
    setter(value);
    AccessibilityInfo.announceForAccessibility(`${label} ${value ? 'включено' : 'выключено'}`);
  };

  return (
    <View style={styles.panel} accessibilityLabel="Настройки поездки">
      <Text style={localStyles.header} accessibilityRole="header">Что сообщить водителю?</Text>

      <View 
        style={localStyles.row} 
        accessible={true}
        accessibilityLabel="Помогите найти машину"
        accessibilityRole="switch"
        accessibilityState={{checked: needsAssistance}}
      >
        <Text style={localStyles.label}>Помогите найти машину</Text>
        <Switch 
          value={needsAssistance} 
          onValueChange={(val) => handleSwitchChange(val, setNeedsAssistance, "Помощь в поиске машины")} 
          color="#4CAF50" 
        />
      </View>

      {needsAssistance && (
        <Text 
          style={localStyles.tip}
          accessibilityLabel="Пожалуйста, опишите как вы выглядите в комментарии к поездке"
        >
          Пожалуйста, опишите, как вы выглядите, в комментарии к поездке ниже
        </Text>
      )}

      <View 
        style={localStyles.row}
        accessible={true}
        accessibilityLabel="Перевозка собаки-поводыря"
        accessibilityRole="switch"
        accessibilityState={{checked: guideDog}}
      >
        <Text style={localStyles.label}>Перевозка собаки-поводыря</Text>
        <Switch 
          value={guideDog} 
          onValueChange={(val) => handleSwitchChange(val, setGuideDog, "Перевозка собаки-поводыря")} 
          color="#4CAF50" 
        />
      </View>

      <View 
        style={localStyles.row}
        accessible={true}
        accessibilityLabel="Общаюсь только текстом"
        accessibilityRole="switch"
        accessibilityState={{checked: textOnly}}
      >
        <Text style={localStyles.label}>Общаюсь только текстом</Text>
        <Switch 
          value={textOnly} 
          onValueChange={(val) => handleSwitchChange(val, setTextOnly, "Общение только текстом")} 
          color="#4CAF50" 
        />
      </View>

      <View 
        style={localStyles.row}
        accessible={true}
        accessibilityLabel="Не говорю, но слышу"
        accessibilityRole="switch"
        accessibilityState={{checked: canHear}}
      >
        <Text style={localStyles.label}>Не говорю, но слышу</Text>
        <Switch 
          value={canHear} 
          onValueChange={(val) => handleSwitchChange(val, setCanHear, "Не говорю, но слышу")} 
          color="#4CAF50" 
        />
      </View>

      <View 
        style={localStyles.row}
        accessible={true}
        accessibilityLabel="Буду с инвалидным креслом"
        accessibilityRole="switch"
        accessibilityState={{checked: hasWheelchair}}
      >
        <Text style={localStyles.label}>Буду с инвалидным креслом</Text>
        <Switch 
          value={hasWheelchair} 
          onValueChange={(val) => handleSwitchChange(val, setHasWheelchair, "Инвалидное кресло")} 
          color="#4CAF50" 
        />
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
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
        accessibilityLabel="Комментарий к поездке"
        accessibilityHint="Нажмите чтобы добавить или изменить комментарий"
        accessibilityRole="button"
      >
        <Text style={localStyles.label}>Комментарий к поездке</Text>
        <MaterialIcons name="chevron-right" size={24} color="#444" />
      </TouchableOpacity>

      <CommentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialComment={comment}
        onSave={setComment}
      />

      <View style={styles.buttonRow}>
        <Button 
          onPress={() => setStep(1)} 
          labelStyle={{ color: '#000' }}
          accessibilityLabel="Вернуться на предыдущий шаг"
        >
          Назад
        </Button>
        <Button 
          mode="contained" 
          onPress={() => setStep(3)} 
          style={[externalStyles.button, localStyles.nextButton]}
          accessibilityLabel="Перейти к следующему шагу"
        >
          Далее
        </Button>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
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
    flex: 1,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    marginTop: -8,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    /* borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 20, */
  },
});