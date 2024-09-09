import React, { useState, useEffect } from 'react';

const TracklistGenerator = () => {
  const [tracklist, setTracklist] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#e0e0e0';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    // Check if the file is a valid Blob type (or File)
    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const { headers, tracks } = parseTracklist(text);
        setColumns(headers);
        setTracklist(tracks);
      };

      // Read the file as text
      reader.readAsText(file);
    } else {
      console.error('Invalid file type. Expected a Blob or File.');
    }
  };

  const parseTracklist = (text) => {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    const headers = lines[0].split('\t');

    const tracks = lines.slice(1).map((line) => {
      const values = line.split('\t');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    return { headers, tracks };
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] p-8 font-mono">
      <h1 className="text-3xl font-bold mb-8 text-center">TRACKLIST GENERATOR</h1>
      <div className="mt-16 text-center"></div>
      <div
        className={`mb-8 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ease-in-out ${dragActive ? 'border-gray-400 bg-gray-800' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        <label className="cursor-pointer">
          <span className="text-lg">DROP .TXT FILE HERE OR CLICK TO SELECT</span>
          <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
      {tracklist.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg">To export your tracklist from Rekordbox:</p>
          <ol className="list-decimal list-inside text-sm mt-4 space-y-2">
            <li>Open Rekordbox and select your playlist.</li>
            <li>
              Right-click and choose <strong>Export Playlist</strong>.
            </li>
            <li>
              Select <strong>Export as .txt file</strong>.
            </li>
            <li>Find the exported file in your chosen destination.</li>
          </ol>
        </div>
      )}

      {tracklist.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a]">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="p-3 text-left text-xs uppercase tracking-wider border-b border-gray-800">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tracklist.map((track, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#1a1a1a] transition-colors duration-150 ease-in-out">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-3 text-sm whitespace-nowrap">
                      {track[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TracklistGenerator;
