import { View, TextInput, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import Feather from '@expo/vector-icons/Feather';

const CommentInput = ({ containerStyles, placeholder, activeColor = '#6575A8', icon, inputRef, setIcon = false, onPress, ...props}) => {

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View 
    className={`${containerStyles}`}
      style={                                         
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isFocused ? activeColor : '#dcdcdc', 
          borderRadius: 8,
          padding: 16,
          gap: 10
        }
      }
    >
      
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor='#7C7C7C'
        ref={inputRef}
        {...props}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)} 
      />
      {setIcon && (
        <TouchableOpacity onPress={onPress} style={{ padding: 5 }}>
          <Feather name="send" size={24} color="black" />
        </TouchableOpacity>
      )}
      </View>
  );
}

export default CommentInput