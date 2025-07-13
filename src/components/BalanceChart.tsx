import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import theme from '~/theme/theme';
import { LinearGradient } from 'react-native-linear-gradient';

type ChartDataPoint = {
    date: Date;
    netWorth: number;
};

type BalanceChartProps = {
    chartData: ChartDataPoint[];
    onPointSelect: (data: { point: ChartDataPoint; index: number } | null) => void;
};

const screenWidth = Dimensions.get('window').width;

const BalanceChart = ({ chartData, onPointSelect }: BalanceChartProps) => {
    if (!chartData || chartData.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading chart data...</Text>
            </View>
        );
    }

    const data = {
        labels: chartData.map((d, i) => {
            if (i % 5 === 0) { // Show fewer labels
                return format(d.date, 'd');
            }
            return '';
        }),
        datasets: [
            {
                data: chartData.map(d => d.netWorth),
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: theme.colors.card,
        backgroundGradientTo: theme.colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 187, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.accent,
        },
    };

    return (
        <View style={styles.container}>
            <LineChart
                data={data}
                width={screenWidth - 80}
                height={200}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                bezier
                style={styles.chart}
                onDataPointClick={({ index }) => {
                    const point = chartData[index];
                    onPointSelect({ point, index });
                }}
                renderGradient={({ from, to, fromOpacity, toOpacity }) => (
                    <LinearGradient
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor={from} stopOpacity={fromOpacity} />
                        <stop offset="1" stopColor={to} stopOpacity={toOpacity} />
                    </LinearGradient>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: theme.spacing.small,
        marginBottom: theme.spacing.medium,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    loadingText: {
        color: theme.colors.mutedForeground,
    }
});

export default BalanceChart;
