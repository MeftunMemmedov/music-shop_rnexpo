import { AboutImage } from '@/assets/images';
import { Text } from '@/components/AppText';
import { Image, ScrollView, View } from 'react-native';

const About = () => {
  return (
    <ScrollView contentContainerClassName="pt-28 container">
      <Text className="font-bold text-2xl mb-3">About Us</Text>
      <Text className="text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ab
        similique pariatur libero ut totam sit nostrum facilis suscipit labore,
        corrupti dolor doloribus consequuntur voluptas, voluptatibus dignissimos
        consectetur! Sed, sunt?
      </Text>
      <View className="w-full aspect-video my-4">
        <Image source={AboutImage} className="size-full" />
      </View>
      <Text className="text-lg mb-10">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa eaque,
        maiores nemo, necessitatibus neque ipsam cumque provident distinctio,
        modi ipsa aliquid. Iste ipsa illo sapiente laborum, vitae expedita
        cupiditate! Quos.
      </Text>

      <Text className="font-bold text-2xl mb-3">Lorem Ipsum</Text>
      <Text className="text-xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        dolorem dolor nam impedit assumenda, cum vel, esse perspiciatis vitae,
        quibusdam ab quis adipisci accusantium facilis. Atque architecto
        excepturi totam esse delectus aspernatur explicabo iusto. Officiis
        soluta, rem error veniam laboriosam repudiandae? Debitis, vero a nostrum
        odio consequuntur labore maxime inventore.
      </Text>
      <View className="h-28" />
    </ScrollView>
  );
};

export default About;
