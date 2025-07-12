
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '~/theme/theme';
import TotalBalance from './TotalBalance';
import MockAccountCard from './MockAccountCard';
import { Wallet, Pin } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const WelcomeDashboardMockup = () => {
  const data = {
    labels: ["2", "8", "14", "20", "26", "1"],
    datasets: [
      {
        data: [252, 273, 293, 314, 334, 318],
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Orange color
        strokeWidth: 2 // optional
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary
    }
  };

  return (
    <View style={styles.container}>
      <TotalBalance title="TOTAL NET WORTH" amount={318768501} />
      <LineChart
        data={data}
        width={screenWidth - theme.spacing.medium * 2} // from screenshot, padding is applied to container
        height={150}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: theme.spacing.large,
          borderRadius: 16
        }}
      />
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity style={styles.timeRangeButton}><Text style={styles.timeRangeText}>7D</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.timeRangeButton, styles.activeTimeRange]}><Text style={[styles.timeRangeText, styles.activeTimeRangeText]}>30D</Text></TouchableOpacity>
        <TouchableOpacity style={styles.timeRangeButton}><Text style={styles.timeRangeText}>1Y</Text></TouchableOpacity>
        <TouchableOpacity style={styles.timeRangeButton}><Text style={styles.timeRangeText}>ALL</Text></TouchableOpacity>
      </View>
      <View style={styles.pinnedContainer}>
        <View style={styles.pinnedHeader}>
          <Pin size={16} color={theme.colors.mutedForeground} />
          <Text style={styles.pinnedTitle}>Pinned</Text>
        </View>
        <MockAccountCard 
          icon={<Wallet size={24} color={theme.colors.primary} />} 
          name="BCA Tahapan Gold" 
          displayNumber="**** 1234" 
          balance="Rp 150.000.000"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: theme.spacing.medium,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  graphContainer: {
    height: 150,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 16,
    marginVertical: theme.spacing.large,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: theme.spacing.medium,
  },
  timeRangeButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: 8,
  },
  activeTimeRange: {
    backgroundColor: theme.colors.primary,
  },
  timeRangeText: {
    color: theme.colors.mutedForeground,
    fontWeight: '600',
  },
  activeTimeRangeText: {
    color: theme.colors.background,
  },
  pinnedContainer: {
    marginTop: theme.spacing.large,
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  pinnedTitle: {
    color: theme.colors.mutedForeground,
    marginLeft: theme.spacing.small,
    fontWeight: '600',
  },
});

export default WelcomeDashboardMockup;
