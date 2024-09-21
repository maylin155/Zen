import { View, TextInput } from 'react-native';
import React, {useState} from 'react';

const CustomTextInput = ({ containerStyles, placeholder, activeColor = '#6575A8', icon, inputRef, ...props }) => {

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
          padding: 8,
          gap: 10,
        }
      }
    >
      {icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor='#7C7C7C'
        ref={inputRef}
        {...props}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)} 
      />
    </View>
  );
}

export default CustomTextInput;
