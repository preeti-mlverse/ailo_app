import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

interface NovaMascotProps {
  animation?: 'wave' | 'cheer' | 'think' | 'happy' | 'sad' | 'idle';
  size?: number;
}

export const NovaMascot: React.FC<NovaMascotProps> = ({ animation = 'idle', size = 100 }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'wave') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animation === 'cheer' || animation === 'happy') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animation]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  // Using placeholder base64 image for Nova (yellow bird mascot)
  // In production, replace with actual mascot image
  const mascotSource = { uri: 'https://customer-assets.emergentagent.com/job_a329ade9-5d70-4ea1-947a-55c6e676cf50/artifacts/jp064i2q_Edtech_Mascot_Animation_Generation.gif' };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: bounceAnim },
            { rotate: animation === 'wave' ? rotate : '0deg' },
          ],
        },
      ]}
    >
      <Image
        source={mascotSource}
        style={[styles.mascot, { width: size, height: size }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 100,
    height: 100,
  },
});
