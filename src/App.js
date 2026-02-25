import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import Chart from './Chart';
import EditableTable from './EditableTable';
import * as d3 from 'd3';

const sampleCsv = `x,y1,y2
1,10,20
2,30,35
3,50,45
4,20,15
5,80,90
6,50,55
7,70,75
8,90,85
9,60,65
10,40,50
`;

const initialData = d3.csvParse(sampleCsv);

const colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'];

function App() {
  const { t, i18n } = useTranslation();
  const [chartData, setChartData] = useState(initialData);
  const [showConnectingLine, setShowConnectingLine] = useState(true);
  const [showTrendLine, setShowTrendLine] = useState(true);
  const [xAxisLabel, setXAxisLabel] = useState('x');
  const [yAxisLabel, setYAxisLabel] = useState('y');
  const [notes, setNotes] = useState('');
  const [seriesColors, setSeriesColors] = useState({});

  useEffect(() => {
    const yColumns = chartData.columns.filter(c => c !== 'x');
    const initialColors = {};
    yColumns.forEach((col, i) => {
      initialColors[col] = colors[i % colors.length];
    });
    setSeriesColors(initialColors);
  }, [chartData.columns]);

  const handleTableUpdate = (newData) => {
    if (newData.length > 0) {
      newData.columns = Object.keys(newData[0]);
    } else {
      newData.columns = [];
    }
    setChartData(newData);
  };

  const handleColorChange = (seriesName, color) => {
    setSeriesColors(prevColors => ({
      ...prevColors,
      [seriesName]: color
    }));
  };

  const seriesData = chartData.columns.filter(c => c !== 'x').map(yCol => ({
    name: yCol,
    color: seriesColors[yCol],
    values: chartData.map(d => ({ x: +d.x, y: +d[yCol] }))
  }));

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('csv_data_visualizer')}</h1>
        <div>
          <button onClick={() => i18n.changeLanguage('en')}>English</button>
          <button onClick={() => i18n.changeLanguage('cs')}>Česky</button>
        </div>
      </header>
      <main>
        <div className="options-panel">
          <div className="controls">
            <div>
              <h3>{t('options')}</h3>
              <div className="toggles">
                <label>
                  {t('show_connecting_line')}
                  <input
                    type="checkbox"
                    checked={showConnectingLine}
                    onChange={() => setShowConnectingLine(!showConnectingLine)}
                  />
                </label>
                <label>
                  {t('show_trend_line')}
                  <input
                    type="checkbox"
                    checked={showTrendLine}
                    onChange={() => setShowTrendLine(!showTrendLine)}
                  />
                </label>
              </div>
            </div>
            <div>
              <h3>{t('labels_and_notes')}</h3>
              <div className="labels">
                <label>
                  {t('x_axis_label')}
                  <input type="text" value={xAxisLabel} onChange={(e) => setXAxisLabel(e.target.value)} />
                </label>
                <label>
                  {t('y_axis_label')}
                  <input type="text" value={yAxisLabel} onChange={(e) => setYAxisLabel(e.target.value)} />
                </label>
              </div>
              <div className="notes">
                <label>
                  {t('notes')}
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="content-panel">
          <div className="left-panel">
            <h3>{t('data')}</h3>
            <EditableTable
              data={chartData}
              onUpdate={handleTableUpdate}
              seriesColors={seriesColors}
              onColorChange={handleColorChange}
            />
          </div>
          <div className="right-panel">
            <div className="graph-container">
              <Chart
                seriesData={seriesData}
                showConnectingLine={showConnectingLine}
                showTrendLine={showTrendLine}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
              />
            </div>
            {notes && (
              <div className="notes-display">
                <h3>{t('notes_display')}</h3>
                <p>{notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
