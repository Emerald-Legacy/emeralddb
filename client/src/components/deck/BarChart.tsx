import { Typography } from '@mui/material';

interface BarChartProps {
  data: {
    name: string;
    value: number;
  }[][];
  title: string;
  colors: string[];
}

export function BarChart({ data, title, colors }: BarChartProps) {
  const maxValue = Math.max(...data.flat().map((d) => d.value));
  const barWidth = 30;
  const barMargin = 10;
  const chartWidth = data[0].length * (data.length * barWidth + barMargin);

  return (
    <div>
      <Typography variant="h6">{title}</Typography>
      <svg width={chartWidth} height={200}>
        <g transform="translate(0, 180)">
          {data.map((group, groupIndex) => (
            <g key={groupIndex}>
              {group.map((d, i) => (
                <g key={i} transform={`translate(${(i * (data.length * barWidth + barMargin)) + (groupIndex * barWidth)}, 0)`}>
                  <rect
                    y={-d.value * (180 / maxValue)}
                    width={barWidth}
                    height={d.value * (180 / maxValue)}
                    fill={colors[groupIndex]}
                  />
                  <text x={barWidth / 2} y={-d.value * (180 / maxValue) - 5} textAnchor="middle">
                    {d.value}
                  </text>
                  <text x={barWidth / 2} y={15} textAnchor="middle">
                    {d.name}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
