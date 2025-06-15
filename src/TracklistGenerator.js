import React, { useState, useEffect } from 'react';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import an arrow icon
import { MdContentCopy } from 'react-icons/md';

const TracklistGenerator = () => {
  const [tracklist, setTracklist] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formattedTracklist, setFormattedTracklist] = useState('');
  const collapsedRows = 5; // Number of rows to show initially
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);

  useEffect(() => {
    updateFormattedTracklist(tracklist);
  }, [showNumbers]);

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
        updateFormattedTracklist(tracks);
      };
      reader.readAsText(file);
    } else {
      console.error('Invalid file type. Expected a Blob or File.');
    }
  };

  const parseTracklist = (text) => {
    const lines = text.split('\n').filter((line) => line.trim() !== '');

    let lastHeaderLine = 0; // the id of the last header line before the first track number
    for (let i = 0; i < lines.length; i++) {
      const firstCol = lines[i].split('\t')[0];
      if (firstCol === '1') {
        lastHeaderLine = i - 1; // The last header line is the one before the first track number
        break;
      }
    }
    // Combine all header lines into one header row
    const headerLines = lines.slice(0, lastHeaderLine + 1);
    const headers = headerLines.join('').split('\t');

    const tracks = lines.slice(lastHeaderLine + 1).map((line) => {
      const values = line.split('\t');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    return { headers, tracks };
  };

  const updateFormattedTracklist = (tracks) => {
    const formatted = tracks
      .map((track, index) => {
        const artist = track['Artist'] || track['Interpret'] || 'Unknown Artist';
        const title = track['Track Title'] || track['Trackname'] || 'Unknown Track';
        return showNumbers ? `${index + 1}. ${artist} - ${title}` : `${artist} - ${title}`;
      })
      .join('\n');
    setFormattedTracklist(formatted);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedTracklist).then(
      () => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 1500); // Feedback visible for 1.5 seconds
      },
      (err) => {
        console.error('Could not copy text: ', err);
        setCopyFeedback(false);
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

  // Resets all state to initial values
  const resetPage = () => {
    setTracklist([]);
    setColumns([]);
    setFormattedTracklist('');
    setIsExpanded(false);
    setCopyFeedback(false);
    setShowNumbers(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-color_background text-color_text px-10 py-8 font-mono">
      <div className="flex-grow">
        {/* <h1 className="text-3xl font-bold mb-8 text-center">TRACKLIST GENERATOR</h1> */}
        <div className="flex justify-center">
          <img
            src="/Logo_smaller.png"
            className="w-2/3 sm:w-1/3 lg:w-1/5 cursor-pointer"
            alt="Tracklist Generator"
            onClick={resetPage}
          />
        </div>

        {/* <div className="mt-16 text-center"></div> */}
        <div
          className={`my-12 p-8 border-2 border-dashed border-color_text rounded-lg p-0 text-center cursor-pointer transition-all duration-300 ease-in-out bg-color_text ${dragActive ? 'border-gray-400 bg-opacity-15' : 'hover:bg-opacity-25 bg-opacity-10'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          <label className="cursor-pointer w-full h-full block">
            <div className="text-lg p-8 font-bold">
              DROP FILE HERE OR CLICK TO SELECT (.TXT FORMAT ONLY)
            </div>
            <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        {tracklist.length === 0 && (
          <div className="mt-16 text-center">
            <p className="">
              This Tracklist Generator helps you convert your Rekordbox playlist to a Tracklist
              format.
            </p>
            <p className="mt-8">How-to:</p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li>Select your playlist in Rekordbox (e.g. from the history)</li>
              <li>
                Right-click and choose <strong>Export Playlist</strong>
              </li>
              <li>
                Select <strong>Export as .txt file</strong>
              </li>
              <li>Drop the .txt file in the area above</li>
            </ol>
          </div>
        )}

        {tracklist.length > 0 && (
          <>
            <div className="text-xl font-bold mb-4">YOUR PLAYLIST</div>
            <div className="relative">
              <div className="relative table-container overflow-x-auto">
                <table className="w-full border-collapse ">
                  <thead>
                    <tr className="bg-color_text bg-opacity-90 text-color_background ">
                      {columns.map((column, index) => (
                        <th key={index} className="p-3 text-left text-xs uppercase tracking-wider ">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-color_text">
                    {tracklist
                      .slice(0, isExpanded ? tracklist.length : collapsedRows)
                      .map((track, index) => (
                        <tr key={index} className="transition-colors duration-150 ease-in-out">
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
                    <FaChevronUp className="text-color_text text-2xl" />
                  </div>
                ) : (
                  <div
                    onClick={toggleRows}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-color_text via-color_text/30 to-transparent cursor-pointer text-center py-4 flex justify-center">
                    <FaChevronDown className="text-color_text text-2xl" />
                  </div>
                ))}
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">FORMATTED TRACKLIST</h2>

              <label className="inline-flex items-center cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={showNumbers}
                  onChange={() => setShowNumbers(!showNumbers)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-text_color dark:peer-focus:ring-text_color rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-color_text"></div>
                <span className="ms-3 text-lg">Show Track Numbers</span>
              </label>
              <pre className="bg-color_text bg-opacity-90 text-color_background p-4 rounded-lg whitespace-pre-wrap">
                {formattedTracklist}
              </pre>
              <div className="flex flex-row mt-4 items-center space-x-4">
                <button
                  onClick={copyToClipboard}
                  className="bg-color_text bg-opacity-90 hover:bg-opacity-100 text-color_background py-2 px-4 rounded transition-colors duration-150 ease-in-out align-middle flex items-center">
                  <MdContentCopy className="inline-block mr-2" />
                  COPY TO CLIPBOARD
                </button>
                <div>
                  {copyFeedback && (
                    <FaCheck
                      className="text-text_color"
                      style={{ animation: 'fadeInOut 1.5s ease-in-out' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <footer className="mt-12 text-end text-xs">
        <p>
          Created by{' '}
          <a
            href="https://jennyhuang.de"
            className="underline"
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
