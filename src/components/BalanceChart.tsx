import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg, {
  Path,
  Line,
  Circle,
  Text,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
  G
} from 'react-native-svg';
import { format } from 'date-fns';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

// Color constants (matching the CSS variables)
const colors = {
  primary: '#0070f3',
  accent: '#7c3aed',
  foreground: '#000000',
  mutedForeground: '#6b7280',
  card: '#ffffff',
  primaryOpacity30: 'rgba(0, 112, 243, 0.3)',
  primaryOpacity05: 'rgba(0, 112, 243, 0.05)',
  foregroundOpacity40: 'rgba(0, 0, 0, 0.4)',
  primaryOpacity60: 'rgba(0, 112, 243, 0.6)',
};

// --- SVG Path Smoothing Helpers ---
const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

const controlPoint = (current, previous, next, reverse) => {
  const p = previous || current;
  const n = next || current;
  const smoothing = 0.2;
  
  const o = line(p, n);
  
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;
  
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;
  
  return [x, y];
};

const createSmoothPath = (points) => {
  if (points.length < 2) {
    return `M ${points[0]?.[0] || 0} ${points[0]?.[1] || 0}`;
  }
  let path = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : undefined;
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : undefined;

    const cp1 = controlPoint(p1, p0, p2);
    const cp2 = controlPoint(p2, p1, p3, true);
    
    path += ` C ${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]} ${p2[0]},${p2[1]}`;
  }

  return path;
};

// --- End of SVG Path Helpers ---

const BalanceChart = ({ chartData: dataPoints, onPointSelect }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeIndex, setActiveIndex] = useState(dataPoints.length > 0 ? dataPoints.length - 1 : 0);
  const svgRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const animationDuration = 800; // ms for the animation to complete
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }
      
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      
      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    // Reset and start animation whenever dataPoints change
    setAnimationProgress(0);
    setActiveIndex(dataPoints.length > 0 ? dataPoints.length - 1 : 0);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dataPoints]);

  useEffect(() => {
    if (dataPoints.length > 0 && activeIndex >= dataPoints.length) {
      const newIndex = dataPoints.length - 1;
      setActiveIndex(newIndex);
      onPointSelect({ point: dataPoints[newIndex], index: newIndex });
    }
  }, [dataPoints, activeIndex, onPointSelect]);

  const chartWidth = Math.min(screenWidth - 40, 350);
  const chartHeight = 180;
  const padding = { top: 10, right: 10, bottom: 30, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Pan responder for touch interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      handleInteraction(evt.nativeEvent, true);
    },
    onPanResponderMove: (evt) => {
      handleInteraction(evt.nativeEvent, false);
    },
    onPanResponderRelease: () => {
      setHoveredPoint(null);
    }
  });

  const handleInteraction = (event, isClick) => {
    const { locationX: x } = event;

    const pointIndex = Math.round(((x - padding.left) / innerWidth) * (dataPoints.length - 1));
    
    if (pointIndex >= 0 && pointIndex < dataPoints.length) {
      const point = dataPoints[pointIndex];
      const pointX = getX(pointIndex);
      
      const threshold = innerWidth / (dataPoints.length - 1) / 2;

      if (Math.abs(x - pointX) < threshold + 5) {
        if (isClick) {
          setActiveIndex(pointIndex);
          onPointSelect({ point, index: pointIndex });
        } else {
          const pointY = getY(point.netWorth);
          setHoveredPoint({ ...point, index: pointIndex, x: pointX, y: pointY });
        }
      } else if (!isClick) {
        setHoveredPoint(null);
      }
    }
  };

  if (!dataPoints || dataPoints.length < 2) {
    return (
      <View style={{
        width: '100%',
        height: chartHeight,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>
          Not enough data to display chart.
        </Text>
      </View>
    );
  }

  const dataMin = Math.min(...dataPoints.map(d => d.netWorth));
  const dataMax = Math.max(...dataPoints.map(d => d.netWorth));
  const dataRange = dataMax - dataMin;
  const rangePadding = dataRange === 0 ? Math.abs(dataMax * 0.2) : dataRange * 0.2;

  const minValue = dataMin - rangePadding;
  const maxValue = dataMax + rangePadding;
  const valueRange = maxValue - minValue === 0 ? 1 : maxValue - minValue;

  const getX = (index) => padding.left + (index / (dataPoints.length - 1)) * innerWidth;
  const getY = (value) => padding.top + ((maxValue - value) / valueRange) * innerHeight;

  const pathPoints = useMemo(() => 
    dataPoints.map((p, i) => [getX(i), getY(p.netWorth)]),
    [dataPoints, rangePadding]
  );
  
  const animatedPoints = pathPoints.slice(0, Math.ceil(pathPoints.length * animationProgress));
  const pathD = createSmoothPath(animatedPoints);

  const createAreaPath = (points) => {
    if (points.length < 2) return "";
    const linePath = createSmoothPath(points);
    const lastX = points[points.length - 1][0];
    return `${linePath} L ${lastX.toFixed(2)} ${chartHeight - padding.bottom} L ${points[0][0].toFixed(2)} ${chartHeight - padding.bottom} Z`;
  };
  
  const areaPathD = createAreaPath(animatedPoints);
  
  const formatYAxisLabel = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
    return value.toString();
  };

  const yAxisTicks = useMemo(() => {
    const tickCount = 4;
    const tickValues = [];
    for (let i = 0; i <= tickCount; i++) {
      tickValues.push(minValue + (i / tickCount) * (maxValue - minValue));
    }
    return tickValues.map(t => ({ value: t, y: getY(t) }));
  }, [dataPoints, rangePadding]);

  const xAxisTicks = useMemo(() => {
    if (dataPoints.length < 2) return [];

    const ticks = [];
    const numPoints = dataPoints.length;
    const maxTicks = numPoints > 30 ? 6 : 5;
    const tickIncrement = Math.max(1, Math.ceil(numPoints / maxTicks));

    for (let i = 0; i < numPoints; i += tickIncrement) {
      const point = dataPoints[i];
      if (point) {
        ticks.push({
          value: point.date,
          x: getX(i),
          index: i
        });
      }
    }
    
    const lastTickX = ticks[ticks.length - 1]?.x;
    const endX = getX(numPoints - 1);

    if (!lastTickX || endX - lastTickX > innerWidth / (maxTicks * 2)) {
      const lastPoint = dataPoints[numPoints - 1];
      ticks.push({
        value: lastPoint.date,
        x: getX(numPoints - 1),
        index: numPoints - 1
      });
    }

    return ticks.filter((tick, index, self) =>
      index === self.findIndex((t) => format(t.value, 'yyyy-MM-dd') === format(tick.value, 'yyyy-MM-dd'))
    );
  }, [dataPoints]);

  const formatXAxisLabel = (date) => {
    const numPoints = dataPoints.length;
    if (numPoints > 90) {
      return format(date, 'MMM');
    }
    if (numPoints > 7) {
      return format(date, 'd');
    }
    return format(date, 'EEE');
  };

  const activePoint = activeIndex !== null && dataPoints[activeIndex] ? 
    { ...dataPoints[activeIndex], index: activeIndex, x: getX(activeIndex), y: getY(dataPoints[activeIndex].netWorth) } : null;

  return (
    <View style={{ 
      width: '100%', 
      height: chartHeight,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <View {...panResponder.panHandlers} style={{ width: chartWidth, height: chartHeight }}>
        <Svg
          ref={svgRef}
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          <Defs>
            <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.05" />
            </LinearGradient>
            <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="100%" stopColor={colors.accent} />
            </LinearGradient>
            <ClipPath id="chartClipPath">
              <Rect x={padding.left - 2} y={padding.top} width={innerWidth + 4} height={innerHeight + 2} />
            </ClipPath>
          </Defs>

          {/* Horizontal Grid Lines (Y-Axis) */}
          {yAxisTicks.map((tick, index) => (
            <G key={`y-grid-${index}`}>
              <Line
                x1={padding.left}
                y1={tick.y}
                x2={chartWidth - padding.right}
                y2={tick.y}
                stroke={colors.foregroundOpacity40}
                strokeWidth="0.5"
                strokeDasharray="2 4"
              />
              <Text
                x={padding.left - 8}
                y={tick.y + 3}
                textAnchor="end"
                fontSize="10"
                fill={colors.mutedForeground}
              >
                {formatYAxisLabel(tick.value)}
              </Text>
            </G>
          ))}

          {/* X-Axis Labels */}
          {xAxisTicks.map((tick, index) => (
            <G key={`x-grid-${index}`}>
              <Text
                x={tick.x}
                y={chartHeight - padding.bottom + 15}
                textAnchor="middle"
                fontSize="10"
                fill={colors.mutedForeground}
              >
                {formatXAxisLabel(tick.value)}
              </Text>
            </G>
          ))}

          {/* Chart Area and Line */}
          <G clipPath="url(#chartClipPath)">
            <Path
              d={areaPathD}
              fill="url(#areaGradient)"
            />
            <Path
              d={pathD}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>

          {/* Active Point Indicator */}
          {activePoint && animationProgress === 1 && (
            <G>
              <Line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={innerHeight + padding.top}
                stroke={colors.primary}
                strokeWidth="1"
                strokeDasharray="3 3"
                strokeOpacity="0.6"
              />
              <Circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="8"
                fill={colors.primaryOpacity30}
              />
              <Circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4"
                fill={colors.primary}
                stroke={colors.card}
                strokeWidth="2"
              />
            </G>
          )}

          {/* Hover Point (different from active point) */}
          {hoveredPoint && hoveredPoint.index !== activeIndex && (
            <G>
              <Circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="4"
                fill={colors.foreground}
              />
            </G>
          )}
        </Svg>
      </View>
    </View>
  );
};

export default BalanceChart;