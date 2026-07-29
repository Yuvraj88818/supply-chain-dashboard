export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    return;
  }

  // Flatten nested objects (like warehouse.name or supplier.name) for CSV
  const flattenObject = (ob) => {
    let result = {};
    for (const i in ob) {
      if ((typeof ob[i]) === 'object' && ob[i] !== null) {
        const flatObject = flattenObject(ob[i]);
        for (const x in flatObject) {
          result[i + '_' + x] = flatObject[x];
        }
      } else {
        result[i] = ob[i];
      }
    }
    return result;
  };

  const flatData = data.map(item => flattenObject(item));
  const headers = Object.keys(flatData[0]);
  
  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const row of flatData) {
    const values = headers.map(header => {
      const val = row[header];
      if (typeof val === 'string') {
        const escaped = val.replace(/"/g, '""');
        return `"${escaped}"`;
      }
      return val !== null && val !== undefined ? val : '';
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
