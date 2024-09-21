import { View, Text, SafeAreaView, KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { UpdateJournal } from '../../services/journalService';
import { router } from 'expo-router';
import Loading from '../../components/Loading';

const JournalEditor = () => {
    const [body, setBody] = useState('');
    const textInputRef = useRef(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, []);

    const onSubmit = async () => {
        if (body === '') {
            Alert.alert("Error", "Empty Journal");
            return; // Early return if body is empty
        }

        let data = {
            body: body,
            userId: user?.id
        };

        setLoading(true);
        let res = await UpdateJournal(data);
        setLoading(false);
        console.log("Post response", res);
        
        if (res.success) {
            setBody('');
            Alert.alert("Successfully updated journal");
            router.back();
        } else {
            Alert.alert("Journal", res.msg);
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView className="flex-1 justify-between m-5">
                <View className="flex-1">
                    <TextInput
                        ref={textInputRef}
                        value={body}
                        onChangeText={setBody}
                        placeholderTextColor="#55575c"
                        placeholder='Start Writing ...'
                        multiline
                        style={{ flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 8, fontSize: 16, textAlignVertical: 'top' }}
                    />

                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <TouchableOpacity style={{ position: 'absolute', right: 10, bottom: 300 }} onPress={onSubmit}>
                                <AntDesign name="checkcircle" size={35} color="#6575A8" />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default JournalEditor;