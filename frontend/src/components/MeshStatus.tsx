import React from 'react';

interface Props {
  messages: any[];
}

export const MeshStatus: React.FC<Props> = ({ messages }) => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-lg">
      <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3">Offline Mesh Monitor</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500 text-sm italic text-center py-4">No offline packets intercepted.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="text-xs bg-gray-900 p-2 rounded border border-gray-700 font-mono">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>{msg.sos_code || 'PACKET'}</span>
                <span className="text-safe">DELIVERED</span>
              </div>
              <p className="text-white">Path: {msg.via_mesh ? 'A → B → C → GW' : 'Direct'}</p>
              <p className="text-gray-500">Severity: {msg.severity}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 text-center border-t border-gray-700 pt-3">
        <span className="text-xs tracking-widest text-gray-400">GATEWAY CONNECTED</span>
      </div>
    </div>
  );
};
