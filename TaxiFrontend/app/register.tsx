import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text, TextInput } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerUser } from '../lib/auth';

const { height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !agree) {
      Alert.alert('Заполните все поля', 'Пожалуйста, заполните все поля и примите условия.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(name, phone, email, password);
      Alert.alert('Добро пожаловать!', 'Регистрация прошла успешно!');
      router.replace('/login');
    } catch (err) {
      console.error(err);
      Alert.alert('Ошибка', err.message || 'Не удалось зарегистрироваться. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: '#FFFFFF', paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -150 : 0}
      >
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Логотип */}
            <View style={styles.logoContainer}>
              <Text style={styles.logoText} accessibilityRole="header">
                <Text style={styles.logoPrimary}>Доступное</Text>
                <Text style={styles.logoSecondary}> такси</Text>
              </Text>
              <View style={styles.logoUnderline} />
            </View>

            <Text style={styles.title}>Создайте аккаунт</Text>

            <View style={styles.inputContainer}>
              <TextInput
                label="Имя"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="flat"
                underlineColor="transparent"
                activeUnderlineColor="#4CAF50"
                left={<TextInput.Icon icon="account-outline" color="#9E9E9E" />}
                theme={{ colors: { primary: '#4CAF50', background: '#FAFAFA' } }}
              />
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                mode="flat"
                underlineColor="transparent"
                activeUnderlineColor="#4CAF50"
                left={<TextInput.Icon icon="email-outline" color="#9E9E9E" />}
                theme={{ colors: { primary: '#4CAF50', background: '#FAFAFA' } }}
                autoCapitalize="none"
              />
              
              <TextInput
                label="Телефон"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
                mode="flat"
                underlineColor="transparent"
                activeUnderlineColor="#4CAF50"
                left={<TextInput.Icon icon="phone-outline" color="#9E9E9E" />}
                theme={{ colors: { primary: '#4CAF50', background: '#FAFAFA' } }}
              />
              
              <TextInput
                label="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="flat"
                underlineColor="transparent"
                activeUnderlineColor="#4CAF50"
                left={<TextInput.Icon icon="lock-outline" color="#9E9E9E" />}
                right={<TextInput.Icon icon="eye-outline" color="#9E9E9E" />}
                theme={{ colors: { primary: '#4CAF50', background: '#FAFAFA' } }}
              />
            </View>

            <View style={styles.checkboxRow}>
              <Checkbox.Android
                status={agree ? 'checked' : 'unchecked'}
                onPress={() => setAgree(!agree)}
                color="#4CAF50"
                uncheckedColor="#757575"
              />
              <Text style={styles.checkboxText}>
                Я согласен с <Text style={styles.link}>условиями использования</Text> и{' '}
                <Text style={styles.link}>политикой конфиденциальности</Text>
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              disabled={!agree || isLoading}
              loading={isLoading}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              Создать аккаунт
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={() => router.push('/login')}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
              icon="login"
            >
              Войти в аккаунт
            </Button>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingTop: 60,
    // paddingBottom removed, handled by SafeAreaView
  },
  container: {
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoPrimary: {
    color: '#4CAF50',
  },
  logoSecondary: {
    color: '#212121',
    fontWeight: '700',
  },
  logoUnderline: {
    height: 4,
    width: 70,
    backgroundColor: '#4CAF50',
    marginTop: 10,
    borderRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    overflow: 'hidden',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  checkboxText: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#616161',
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  button: {
    borderRadius: 12,
    height: 48,
    backgroundColor: '#4CAF50',
    elevation: 0,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9E9E9E',
    fontSize: 14,
  },
  secondaryButton: {
    borderRadius: 12,
    height: 48,
    borderColor: '#E0E0E0',
    borderWidth: 1.5,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
});