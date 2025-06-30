interface ConflictViewerProps {
  mergedContent: string[];
  hasConflict: boolean;
  onResolve: () => void;
  isResolving?: boolean;
}

export const ConflictViewer: React.FC<ConflictViewerProps> = ({
  mergedContent,
  hasConflict,
  isResolving,
  onResolve,
}) => {
  const getLineClass = (line: string, index: number, lines: string[]) => {
    if (line.startsWith('<<<<<<<')) return 'bg-red-700 font-bold text-white';
    if (line.startsWith('=======')) return 'bg-red-600 text-white';
    if (line.startsWith('>>>>>>>')) return 'bg-red-700 font-bold text-white';

    let localStart = -1;
    let separator = -1;
    let remoteEnd = -1;

    for (let i = index; i >= 0; i--) {
      if (lines[i].startsWith('<<<<<<<')) {
        localStart = i;
        break;
      }
    }

    if (localStart !== -1) {
      for (let i = localStart + 1; i < lines.length; i++) {
        if (separator === -1 && lines[i].startsWith('=======')) {
          separator = i;
        } else if (lines[i].startsWith('>>>>>>>')) {
          remoteEnd = i;
          break;
        }
      }
    }

    if (localStart !== -1 && separator !== -1 && remoteEnd !== -1) {
      if (index > localStart && index < separator) return 'bg-blue-400/30';   // LOCAL
      if (index > separator && index < remoteEnd) return 'bg-green-300/30';   // REMOTE
    }

    return '';
  };

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Merged Result:</h2>
      <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-[500px] text-sm">
        {mergedContent.map((line, idx) => (
          <div key={idx} className={getLineClass(line, idx, mergedContent)}>
            {line}
          </div>
        ))}
      </pre>
      {hasConflict && (
        <button
          onClick={onResolve}
          disabled={isResolving}
          className={`mt-4 ${
            isResolving ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-bold py-2 px-4 rounded`}
        >
          {isResolving ? 'Resolving...' : 'Resolve Conflict'}
        </button>
      )}
    </div>
  );
};

