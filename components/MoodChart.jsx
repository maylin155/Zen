import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const MoodChart = ({moodValues}) => {
    // Map mood values (0 = 😢 to 5 = 😁)
    const moodEmojis = ['😞', '😕', '😐', '😊', '😇'];  // Emoji list from 0 to 5

    // Mood data (values from 0 to 5 for each day)
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: moodValues
            },
            {
                data: [0],
                withDots: false
            },
            {
                data: [4],
                withDots: false
            }
        ]
    };

    return (
        <View style={styles.container}>
            <Text style={{position: 'absolute', top: 10, left: 20, fontSize: '16px'}} className="font-psemibold tracking-wider text-gray-700">Mood Chart</Text>
            <View style={styles.emojiContainer}>
                {moodEmojis.reverse().map((emoji, index) => (
                    <Text key={index} style={styles.emoji}>{emoji}</Text>
                ))}
            </View>

            <LineChart
                data={data}
                width={280}  // Adjust as needed
                height={250}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1}
                verticalLabelRotation={0}
                chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    minY: 0,
                    maxY: 5,
                    color: (opacity = 1) => `rgba(139, 134, 178, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "3",
                        strokeWidth: "2",
                        stroke: "#8b86b2"
                    }
                }}
                bezier
                style={styles.chart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 350,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        marginBottom: 10,
    },
    emojiContainer: {
        gap: 17,
        height: 190,  // Match chart height
        position: 'absolute',
        zIndex: 2,
        top: 50,
        left: 10
    },
    emoji: {
        fontSize: 24,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 0,
        paddingRight: 13,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 50,
        marginTop: 40
    },
});

export default MoodChart;
