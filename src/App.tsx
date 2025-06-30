import { useRef, useState } from 'react';
import { FileInput, type FileInputRef } from './components/FileInput';
import { ConflictViewer } from './components/ConflictViewer';
import { diff3Merge, type MergeRegion } from 'node-diff3';

type ResolvedLine = {
  line: string;
  source?: 'local' | 'remote' | 'complex';
};

function App() {
  const [base, setBase] = useState('');
  const [local, setLocal] = useState('');
  const [remote, setRemote] = useState('');
  const [conflictContent, setConflictContent] = useState<string[]>([]);
  const [hasConflict, setHasConflict] = useState(false);
  const [resolvedContent, setResolvedContent] = useState<ResolvedLine[]>([]);
  const [conflictType, setConflictType] = useState<'A' | 'B' | 'Kompleks' | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const baseRef = useRef<FileInputRef>(null);
  const localRef = useRef<FileInputRef>(null);
  const remoteRef = useRef<FileInputRef>(null);

  const detectConflict = () => {
    if (!base || !local || !remote) return;

    const baseLines = base.split('\n');
    const localLines = local.split('\n');
    const remoteLines = remote.split('\n');

    const result = diff3Merge(localLines, baseLines, remoteLines);
    const merged: string[] = [];

    result.forEach((part: MergeRegion<string>) => {
      if (part.ok) {
        merged.push(...part.ok);
      } else if (part.conflict) {
        merged.push('<<<<<<< LOCAL');
        merged.push(...part.conflict.a);
        merged.push('=======');
        merged.push(...part.conflict.b);
        merged.push('>>>>>>> REMOTE');
      }
    });

    setConflictContent(merged);
    setHasConflict(merged.some(line => line.startsWith('<<<<<<<')));
    setResolvedContent([]);
    setConflictType(null);
  };

  const resolveConflict = async () => {
    setIsResolving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DEV}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base, local, remote }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error('Resolve failed:', err);
        alert('Error resolving conflict: ' + (err.error || 'Unknown error'));
        return;
      }

      const data = await response.json();
      const type = data.conflict_type as 'A' | 'B' | 'Kompleks';
      const resolvedCode = data.resolved_code?.split('\n') || ['[No resolved code returned]'];

      const source =
        type === 'A' ? 'local' : type === 'B' ? 'remote' : 'complex';

      setConflictType(type);
      setResolvedContent(resolvedCode.map((line: string) => ({ line, source })));
    } catch (error) {
      console.error('Request error:', error);
      alert('Error resolving conflict. See console for details.');
    } finally {
      setIsResolving(false);
    }
  };

  const clearInputs = () => {
    setBase('');
    setLocal('');
    setRemote('');
    setConflictContent([]);
    setResolvedContent([]);
    setHasConflict(false);
    setConflictType(null);

    baseRef.current?.resetFile();
    localRef.current?.resetFile();
    remoteRef.current?.resetFile();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-start py-10 px-4">
      <div className="w-1/2 max-w-md pr-8">
        <h1 className="text-3xl font-bold mb-8">Merge Conflict Detector</h1>
        <FileInput ref={baseRef} label="Base Version" onFileChange={setBase} />
        <FileInput ref={localRef} label="Local Version" onFileChange={setLocal} />
        <FileInput ref={remoteRef} label="Remote Version" onFileChange={setRemote} />
        <div className="flex gap-2 mt-4">
          <button
            onClick={detectConflict}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Detect Conflict
          </button>
          <button
            onClick={clearInputs}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="w-1/2">
        {conflictContent.length > 0 && resolvedContent.length === 0 && (
          <ConflictViewer
            mergedContent={conflictContent}
            hasConflict={hasConflict}
            onResolve={resolveConflict}
            isResolving={isResolving}
          />
        )}

        {resolvedContent.length > 0 && (
          <div className="bg-gray-900 p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Resolved Result:</h2>
            {conflictType && (
              <p className="mb-2 text-sm text-gray-400">
                Predicted Resolution:{' '}
                <span className="font-bold">{conflictType}</span>
              </p>
            )}
            <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-[500px] text-sm">
              {resolvedContent.map(({ line, source }, idx) => {
                const bgClass =
                  source === 'local'
                    ? 'bg-blue-300/30'
                    : source === 'remote'
                    ? 'bg-green-300/30'
                    : source === 'complex'
                    ? 'bg-yellow-200/30'
                    : '';
                return (
                  <div key={idx} className={bgClass}>
                    {line}
                  </div>
                );
              })}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
