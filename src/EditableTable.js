import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ColorPicker from './ColorPicker';
import './EditableTable.css';

const EditableTable = ({ data, onUpdate, seriesColors, onColorChange }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleCellChange = (e, rowIndex, colName) => {
    const newText = e.target.textContent;
    const oldText = tableData[rowIndex][colName];
    
    if (/^[0-9]*$/.test(newText)) {
      const newData = [...tableData];
      newData[rowIndex][colName] = newText;
      setTableData(newData);
      onUpdate(newData);
    } else {
      e.target.textContent = oldText;
    }
  };

  const handleHeaderChange = (e, oldColName) => {
    const newColName = e.target.textContent;
    if (newColName && newColName !== oldColName) {
      const newData = tableData.map(row => {
        const newRow = {};
        Object.keys(row).forEach(key => {
          if (key === oldColName) {
            newRow[newColName] = row[oldColName];
          } else {
            newRow[key] = row[key];
          }
        });
        return newRow;
      });
      setTableData(newData);
      onUpdate(newData);
    }
  };

  const addRow = () => {
    const newRow = columns.reduce((acc, col) => {
      acc[col] = '';
      return acc;
    }, {});
    const newData = [...tableData, newRow];
    setTableData(newData);
    onUpdate(newData);
  };

  const removeRow = (rowIndex) => {
    const newData = [...tableData];
    newData.splice(rowIndex, 1);
    setTableData(newData);
    onUpdate(newData);
  };

  const addColumn = () => {
    const newColName = prompt(t('enter_new_column_name'));
    if (newColName && !columns.includes(newColName)) {
      const newData = tableData.map(row => ({ ...row, [newColName]: '' }));
      setTableData(newData);
      onUpdate(newData);
    }
  };

  const removeColumn = (colName) => {
    const newData = tableData.map(row => {
      const newRow = { ...row };
      delete newRow[colName];
      return newRow;
    });
    setTableData(newData);
    onUpdate(newData);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  if (columns.length === 0) {
    return (
      <div>
        <button onClick={addColumn}>{t('add_column')}</button>
        <button onClick={addRow}>{t('add_row')}</button>
      </div>
    );
  }

  return (
    <div className="editable-table">
        <div className="table-container">
            <div className="table-header">
                {columns.map(col => (
                <div key={col} className="table-col">
                    <div className="header-cell">
                    <div className="header-top">
                      <span contentEditable={col !== 'x'} onBlur={(e) => handleHeaderChange(e, col)} suppressContentEditableWarning>{col}</span>
                    </div>
                    {col !== 'x' && (
                      <div className="header-bottom">
                        <div className="header-bottom-left">
                          <ColorPicker color={seriesColors[col]} onColorChange={(color) => onColorChange(col, color)} />
                        </div>
                        <div className="header-bottom-right">
                          <button className="remove-col" onClick={() => removeColumn(col)}> &times; </button>
                        </div>
                      </div>
                    )}
                    </div>                    {tableData.map((row, i) => (
                    <div
                        key={i}
                        className="table-cell"
                        contentEditable
                        onBlur={(e) => handleCellChange(e, i, col)}
                        suppressContentEditableWarning
                    >
                        {row[col]}
                    </div>
                    ))}
                </div>
                ))}
                <div className="table-col">
                    <div className="header-cell">{t('actions')}</div>
                    {tableData.map((row, i) => (
                        <div key={i} className="table-cell">
                        <button onClick={() => removeRow(i)}>{t('remove')}</button>
                        </div>
                    ))}
                </div>
            </div>
      </div>
      <div className="table-footer">
      <button onClick={addRow} className="add-button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3.5V12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.5 8H12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {t('add_row')}
      </button>
      <button onClick={addColumn} className="add-button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3.5V12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.5 8H12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {t('add_column')}
      </button>
      </div>    </div>
  );
};

export default EditableTable;

