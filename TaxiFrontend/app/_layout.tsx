// app/_layout.tsx
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getToken } from '../lib/auth';

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        console.log('Token:', token);
        console.log('Current pathname:', pathname);

        if (!token && pathname !== '/login' && pathname !== '/register') {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error during auth check:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}