import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import an arrow icon

const TracklistGenerator = () => {
  const [tracklist, setTracklist] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formattedTracklist, setFormattedTracklist] = useState('');
  const collapsedRows = 5; // Number of rows to show initially
  const [isExpanded, setIsExpanded] = useState(false);

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
    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const { headers, tracks } = parseTracklist(text);
        setColumns(headers);
        setTracklist(tracks);
        setIsExpanded(false);
        generateFormattedTracklist(tracks);
      };
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

  const generateFormattedTracklist = (tracks) => {
    const formatted = tracks
      .map((track, index) => {
        const artist = track['Artist'] || track['Interpret'] || 'Unknown Artist';
        const title = track['Track Title'] || track['Trackname'] || 'Unknown Track';
        return `${index + 1}. ${artist} - ${title}`;
      })
      .join('\n');
    setFormattedTracklist(formatted);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedTracklist).then(
      () => {
        alert('Formatted tracklist copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const toggleRows = () => {
    // if (isExpanded) {
    //   setVisibleRows(5);
    // } else {
    //   setVisibleRows(tracklist.length); // Show all rows
    // }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#e0e0e0] p-8 font-mono">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">TRACKLIST GENERATOR</h1>
        <div className="mt-16 text-center"></div>
        <div
          className={`mb-8 border-2 border-dashed border-lime-200 rounded-lg p-0 text-center cursor-pointer transition-all duration-300 ease-in-out ${dragActive ? 'border-gray-400 bg-gray-800' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          <label className="cursor-pointer w-full h-full block">
            <div className="text-lg text-lime-200 p-8">DROP .TXT FILE HERE OR CLICK TO SELECT</div>
            <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        {tracklist.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg">
              This Tracklist Generator helps you generate a tracklist from your exported Rekordbox
              playlist.
            </p>
            <p className="text-lg mt-8">To export a playlist:</p>
            <ol className="list-decimal list-inside text-sm mt-4 space-y-2">
              <li>Open Rekordbox and select your playlist (e.g. from the history).</li>
              <li>
                Right-click and choose <strong>Export Playlist</strong>.
              </li>
              <li>
                Select <strong>Export as .txt file</strong>.
              </li>
            </ol>
          </div>
        )}

        {tracklist.length > 0 && (
          <>
            <div className="mb-4">Your selected playlist:</div>
            <div className="relative">
              <div className="relative table-container overflow-x-auto">
                <table className="w-full border-collapse ">
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
                    {tracklist
                      .slice(0, isExpanded ? tracklist.length : collapsedRows)
                      .map((track, index) => (
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
              {tracklist.length > 5 &&
                (isExpanded ? (
                  <div
                    onClick={toggleRows}
                    className="w-full cursor-pointer text-center py-4 flex justify-center">
                    <FaChevronUp className="text-lime-200 text-2xl" />
                  </div>
                ) : (
                  <div
                    onClick={toggleRows}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent cursor-pointer text-center py-4 flex justify-center">
                    <FaChevronDown className="text-lime-200 text-2xl" />
                  </div>
                ))}
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">FORMATTED TRACKLIST</h2>
              <pre className="bg-[#1a1a1a] p-4 rounded-lg whitespace-pre-wrap">
                {formattedTracklist}
              </pre>
              <button
                onClick={copyToClipboard}
                className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-150 ease-in-out">
                COPY TO CLIPBOARD
              </button>
            </div>
          </>
        )}
      </div>
      <footer className="mt-12 text-end text-xs text-gray-400">
        <p>
          Created by{' '}
          <a
            href="https://jennyhuang.de"
            className="text-lime-200 underline"
            target="_blank"
            rel="noopener noreferrer">
            Jenny Huang
          </a>
        </p>
      </footer>
    </div>
  );
};

export default TracklistGenerator;
