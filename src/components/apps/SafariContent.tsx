import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Share, Globe } from "lucide-react";

const SafariContent = () => {
  const [url, setUrl] = useState("https://www.wikipedia.org");
  const [input, setInput] = useState("https://www.wikipedia.org");

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-12 bg-[#f1f1f1] border-b border-gray-300 flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><ChevronLeft size={18} /></button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><ChevronRight size={18} /></button>
        </div>
        <form 
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            let newUrl = input;
            if (!newUrl.startsWith('http')) newUrl = 'https://' + newUrl;
            setUrl(newUrl);
          }}
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </form>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Share size={16} /></button>
      </div>
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="Safari Browser"
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-gray-50/10 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 text-center max-w-sm">
            <Globe className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm text-gray-600 font-medium">Some websites may not display in this demo due to security policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafariContent;
