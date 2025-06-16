import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginUser } from '../lib/auth';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Заполните все поля', 'Пожалуйста, введите телефон и пароль');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(phone, password);
      Alert.alert('Добро пожаловать!', 'Вы успешно вошли в систему');
      router.replace('/screens/MainScreen');
    } catch (err) {
      console.error('Ошибка при входе:', err);
      const errorMessage = (err as any)?.response?.data?.message || 'Неверный телефон или пароль';
      Alert.alert('Ошибка входа', errorMessage);
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

            <Text style={styles.title}>Вход в аккаунт</Text>

            <View style={styles.inputContainer}>
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
                accessibilityLabel="Введите ваш телефон"
                autoComplete="tel"
                importantForAutofill="yes"
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
                accessibilityLabel="Введите ваш пароль"
                autoComplete="password"
                importantForAutofill="yes"
              />
            </View>

            <View style={styles.optionsRow}>
              <View style={styles.checkboxRow}>
                <Checkbox.Android
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setRememberMe(!rememberMe)}
                  color="#4CAF50"
                  uncheckedColor="#757575"
                  accessibilityLabel="Запомнить меня"
                />
                <Text 
                  onPress={() => setRememberMe(!rememberMe)}
                  style={styles.checkboxText}
                  accessibilityRole="checkbox"
                >
                  Запомнить меня
                </Text>
              </View>

              <Button
                mode="text"
                onPress={() => router.push('/forgot-password')}
                labelStyle={styles.forgotPassword}
                accessibilityLabel="Восстановить пароль"
              >
                Забыли пароль?
              </Button>
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              accessibilityLabel="Войти в аккаунт"
            >
              Войти
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={() => router.push('/register')}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
              icon="account-plus"
              accessibilityLabel="Зарегистрироваться"
            >
              Создать аккаунт
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    color: '#616161',
    fontSize: 14,
  },
  forgotPassword: {
    color: '#4CAF50',
    fontSize: 14,
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