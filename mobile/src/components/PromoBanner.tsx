import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface PromoBannerProps {
  title: string;
  description: string;
  image?: any;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ title, description, image }) => {
  const content = (
    <LinearGradient
      colors={['rgba(76,106,86,0.85)', 'rgba(76,106,86,0.35)']}
      className="flex-1 justify-end p-6"
    >
      <Text className="text-white text-2xl font-semibold mb-2">{title}</Text>
      <Text className="text-white/90 text-sm">{description}</Text>
    </LinearGradient>
  );

  if (image) {
    return (
      <ImageBackground source={image} className="h-44 rounded-3xl overflow-hidden mb-6">
        {content}
      </ImageBackground>
    );
  }

  return (
    <View className="h-44 rounded-3xl overflow-hidden mb-6">
      {content}
    </View>
  );
};
