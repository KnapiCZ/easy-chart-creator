import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Chart = ({ seriesData, showConnectingLine, showTrendLine, xAxisLabel, yAxisLabel }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (seriesData && seriesData.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const margin = { top: 20, right: 30, bottom: 60, left: 230 };
      const width = 700 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const allXValues = seriesData.flatMap(series => series.values.map(d => d.x));
      const allYValues = seriesData.flatMap(series => series.values.map(d => d.y));

      const x = d3.scaleLinear()
        .domain(d3.extent(allXValues))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(allYValues)])
        .nice()
        .range([height, 0]);

      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append('g')
        .call(d3.axisLeft(y));

      // X axis label
      svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top + 40)
        .text(xAxisLabel);

      // Y axis label
      svg.append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('y', margin.left - 40)
        .attr('x', -height / 2 - margin.top)
        .text(yAxisLabel);

      seriesData.forEach((series, i) => {
        if (showConnectingLine) {
          const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y));

          g.append('path')
            .datum(series.values)
            .attr('fill', 'none')
            .attr('stroke', series.color)
            .attr('stroke-width', 1.5)
            .attr('d', line);
        }

        if (showTrendLine) {
          const linearRegression = (data) => {
            const n = data.length;
            const sumX = d3.sum(data, d => d.x);
            const sumY = d3.sum(data, d => d.y);
            const sumXY = d3.sum(data, d => d.x * d.y);
            const sumXX = d3.sum(data, d => d.x * d.x);
            
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            
            return { slope, intercept };
          };

          const { slope, intercept } = linearRegression(series.values);
          const trendline = d3.line()
            .x(d => x(d.x))
            .y(d => y(slope * d.x + intercept));
          
          g.append('path')
            .datum(series.values)
            .attr('fill', 'none')
            .attr('stroke', series.color)
            .attr('stroke-width', 2)
            .style('stroke-dasharray', ('3, 3'))
            .attr('d', trendline);
          
          const equation = `${series.name}: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
          svg.append('rect')
            .attr('x', 10)
            .attr('y', margin.top + 10 + i * 20)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', series.color);

          svg.append('text')
            .attr('x', 25)
            .attr('y', margin.top + 20 + i * 20)
            .text(equation)
            .attr('font-size', '12px')
            .attr('fill', 'black');
        }
        
        const sortedValues = [...series.values].sort((a, b) => a.x - b.x);

        const dots = g.selectAll(`.dot-${series.name}`)
          .data(sortedValues)
          .enter().append('g')
          .attr('class', `dot-${series.name}`)
          .attr('transform', d => `translate(${x(d.x)},${y(d.y)})`);

        dots.append('circle')
          .attr('r', 5)
          .attr('fill', series.color);

        const lastYs = [-10, 20];
        let lastLabelX = -Infinity;
        dots.append('text')
          .text(d => d.y)
          .attr('y', (d, i) => {
            const currentX = x(d.x);
            if (i > 0 && currentX - lastLabelX < 30) {
              lastYs.reverse();
            }
            lastLabelX = currentX;
            return lastYs[0];
          })
          .attr('text-anchor', 'middle');
      });
    }
  }, [seriesData, showConnectingLine, showTrendLine, xAxisLabel, yAxisLabel]);

  return <svg ref={svgRef} width="700" height="400"></svg>;
};

export default Chart;

