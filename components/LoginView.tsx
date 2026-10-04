import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginView({ epost, setEpost, passord, setPassord, loggInn, laster }: any) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 items-center justify-center bg-[#F7F7F6] px-8">
      <Text className="text-4xl font-black text-[#111827] mb-2 tracking-tighter">CUT & COUNT</Text>
      <Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">Logg inn for å starte dagen</Text>
      
      <View className="w-full space-y-4 gap-4">
        <TextInput 
          className="w-full bg-white px-5 py-4 rounded-[20px] text-base font-medium border border-[#DCDCDA] shadow-sm" 
          placeholder="E-post" 
          keyboardType="email-address" 
          autoCapitalize="none" 
          value={epost} 
          onChangeText={setEpost} 
        />
        <TextInput 
          className="w-full bg-white px-5 py-4 rounded-[20px] text-base font-medium border border-[#DCDCDA] shadow-sm" 
          placeholder="Passord" 
          secureTextEntry 
          value={passord} 
          onChangeText={setPassord} 
        />
        <TouchableOpacity 
          className="w-full bg-[#111827] py-5 rounded-[20px] items-center mt-4 shadow-lg active:scale-95 transition-transform" 
          onPress={loggInn}
        >
          {laster ? <ActivityIndicator color="#4ADE80" /> : <Text className="text-[#4ADE80] text-base font-black uppercase tracking-widest">Logg inn</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}