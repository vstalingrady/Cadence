import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import theme from '~/theme/theme';

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
            if (i === 0 || i === Math.floor(chartData.length / 2) || i === chartData.length - 1) {
                return format(d.date, 'd MMM');
            }
            return '';
        }),
        datasets: [
            {
                data: chartData.map(d => d.netWorth),
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                strokeWidth: 3,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: theme.colors.card,
        backgroundGradientTo: theme.colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: theme.colors.primary,
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
                withOuterLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={false}
                bezier
                style={styles.chart}
                onDataPointClick={({ index }) => {
                    const point = chartData[index];
                    onPointSelect({ point, index });
                }}
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
