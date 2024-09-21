import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const TextEditor = ({
    editorRef,
    onChange
}) => {
    return (
        <View style={{ flex: 1, minHeight: 285 }}>

            {/* Rich Toolbar */}
            <RichToolbar
                editor={editorRef}
                actions={[
                    actions.insertImage,
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.setStrikethrough,
                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,
                    actions.setUnderline,
                    actions.removeFormat,
                    actions.insertVideo,
                    actions.checkboxList,
                    actions.undo,
                    actions.redo,
                    actions.heading1,
                    actions.heading4
                ]}
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>,
                    [actions.heading4]: ({ tintColor }) => <Text style={{ color: tintColor }}>H4</Text>
                }}
                style={styles.richBar}
                flatContainerStyle={styles.listStyle}
                disabled={false}
                iconTint={'#494949'}
                selectedIconTint={'#00C26F'}

            />

            {/* Rich Editor */}
            <RichEditor
                ref={editorRef}
                style={styles.richEditor}
                editorStyle={styles.contentStyle}
                placeholder={"What's on your mind?"}
                onChange={onChange}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        editorRef.current.blurContentEditor();  // Dismiss the keyboard
                        event.preventDefault();
                    }
                }}
            />
        </View>
    );
}

export default TextEditor;


const styles = StyleSheet.create({
    richEditor: {
        flex: 1,
        minHeight: 240,
        padding: 1,
        borderWidth: 0.2,
        // borderTopWidth: 0,
        // borderBottomLeftRadius: 18,
        // borderBottomRightRadius: 18,
        borderColor: '#e3e3e3',

    },
    richBar: {
        backgroundColor: '#e3e3e3',
        borderTopWidth: 1,
        borderColor: '#ddd',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
    },
    listStyle: {
        paddingHorizontal: 10,
        gap: 2
    }
});
