import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, FontFamily, FontSize, Radius } from '../../constants/theme';

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFill} />
        ),
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📸" label="Scan" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⭐" label="Rewards" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="islamic"
        options={{
          title: 'Islamic',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🌙" label="Islamic" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="parent"
        options={{
          title: 'Parent',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👩‍👦" label="Parent" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 80,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.lg,
    gap: 2,
  },
  tabIconActive: {
    backgroundColor: Colors.primary + '20',
  },
  tabEmoji: {
    fontSize: 24,
    opacity: 0.55,
  },
  tabEmojiActive: {
    opacity: 1,
  },
  tabLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.micro,
    color: Colors.textTertiary,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});

