import React from "react";

interface Props {
  messages: any[];
}

export const MeshStatus: React.FC<Props> = ({ messages }) => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 p-5 shadow-sm dark:shadow-none">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 pb-3 mb-4">
        Offline Mesh Monitor
      </h2>
      {messages.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-500 text-sm italic text-center py-4">
          No offline packets intercepted.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="text-xs bg-gray-50 dark:bg-black p-3 rounded-lg border border-gray-200 dark:border-zinc-800 font-mono shadow-sm dark:shadow-none"
            >
              <div className="flex justify-between text-gray-600 dark:text-gray-400 dark:text-gray-600 mb-2 font-medium">
                <span className="text-gray-900 dark:text-gray-100">{msg.sos_code || "PACKET"}</span>
                <span className="text-green-600">DELIVERED</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                Path: {msg.via_mesh ? "A → B → C → GW" : "Direct"}
              </p>
              <p className="text-gray-500 dark:text-gray-500">Severity: {msg.severity}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-center border-t border-gray-200 dark:border-zinc-800 pt-3">
        <span className="text-xs font-medium uppercase tracking-wider text-green-600 flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          Gateway Connected
        </span>
      </div>
    </div>
  );
};
