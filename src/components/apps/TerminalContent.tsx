import React, { useState, useRef, useEffect } from "react";

interface TerminalContentProps {
  files: Record<string, any[]>;
}

const TerminalContent: React.FC<TerminalContentProps> = ({ files }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("Documents");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    const args = trimmedCmd.toLowerCase().split(' ');
    const mainCmd = args[0];
    let output: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        output = (
          <div className="grid grid-cols-[100px,1fr] gap-x-4 text-white/50">
            <span className="text-blue-400 font-bold">ls</span><span>list directory contents</span>
            <span className="text-blue-400 font-bold">cd [dir]</span><span>change directory</span>
            <span className="text-blue-400 font-bold">cat [file]</span><span>show file content</span>
            <span className="text-blue-400 font-bold">clear</span><span>clear terminal screen</span>
            <span className="text-blue-400 font-bold">neofetch</span><span>show system information</span>
            <span className="text-blue-400 font-bold">date</span><span>print current date</span>
            <span className="text-blue-400 font-bold">whoami</span><span>print effective user id</span>
            <span className="text-blue-400 font-bold">pwd</span><span>print working directory</span>
            <span className="text-blue-400 font-bold">help</span><span>show this help message</span>
          </div>
        );
        break;
      case 'ls':
        const currentFiles = files[currentPath] || [];
        output = (
          <div className="flex flex-wrap gap-x-6">
            {currentFiles.map(f => (
              <span key={f.id} className={f.type === 'folder' ? 'text-blue-400 font-bold' : 'text-white'}>
                {f.name}
              </span>
            ))}
          </div>
        );
        break;
      case 'pwd':
        output = <div className="text-white/80">/Users/hadigunawan/{(currentPath)}</div>;
        break;
      case 'whoami':
        output = <div className="text-white/80">hadigunawan</div>;
        break;
      case 'date':
        output = <div className="text-white/80">{new Date().toString()}</div>;
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'neofetch':
        output = (
          <div className="flex gap-6 mt-2">
            <div className="text-white font-bold text-lg leading-none opacity-50">
              ####<br/>
              ######<br/>
              ###<br/>
              ###<br/>
              ######<br/>
              ####
            </div>
            <div className="text-[12px] opacity-90">
              <span className="text-blue-400 font-bold">user@macbook-pro</span><br/>
              ------------------<br/>
              <span className="text-blue-400 font-bold">OS:</span> macOS Web Clone 14.0<br/>
              <span className="text-blue-400 font-bold">Kernel:</span> x86_64 Webkit<br/>
              <span className="text-blue-400 font-bold">Uptime:</span> 1 hour<br/>
              <span className="text-blue-400 font-bold">Shell:</span> hadish 1.0<br/>
              <span className="text-blue-400 font-bold">Resolution:</span> {window.innerWidth}x{window.innerHeight}<br/>
              <span className="text-blue-400 font-bold">DE:</span> Aqua-React<br/>
              <span className="text-blue-400 font-bold">WM:</span> Framer-Motion<br/>
            </div>
          </div>
        );
        break;
      case 'cd':
        const targetDir = args[1];
        if (!targetDir || targetDir === '~') {
          setCurrentPath("Documents");
        } else if (targetDir === '..') {
          const parts = currentPath.split('/');
          if (parts.length > 1) {
            parts.pop();
            setCurrentPath(parts.join('/'));
          } else {
            setCurrentPath("Documents");
          }
        } else {
          const folders = (files[currentPath] || []).filter(f => f.type === 'folder');
          const found = folders.find(f => f.name.toLowerCase() === targetDir.toLowerCase());
          if (found) {
            setCurrentPath(prev => `${prev}/${found.name}`);
          } else {
            output = <div className="text-red-400">cd: no such directory: {targetDir}</div>;
          }
        }
        break;
      case 'cat':
        const fileToRead = args[1];
        if (!fileToRead) {
          output = <div className="text-red-400">usage: cat [file]</div>;
        } else {
          const foundFile = (files[currentPath] || []).find(f => f.name.toLowerCase() === fileToRead.toLowerCase() && f.type === 'file');
          if (foundFile) {
            output = <div className="text-white/80 opacity-70 mt-1 whitespace-pre-wrap px-2 border-l border-white/10">This is the simulated content of {foundFile.name}.\nIn a real terminal, you would see the file text right here.</div>;
          } else {
            output = <div className="text-red-400">cat: {fileToRead}: No such file</div>;
          }
        }
        break;
      default:
        output = <div className="text-white/60">zsh: command not found: {mainCmd}</div>;
    }

    setHistory(prev => [...prev, { cmd: trimmedCmd, output, path: currentPath }]);
    setInput("");
  };

  return (
    <div 
      className="bg-[#1e1e1e]/95 backdrop-blur-xl text-green-400 font-mono p-4 h-full text-sm leading-relaxed overflow-auto scroll-smooth"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="text-gray-500 mb-4 opacity-70">Last login: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} on ttys001</div>
      
      {history.map((line, i) => (
        <div key={i} className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium opacity-80">macbook-pro</span>
            <span className="text-blue-400">~{line.path.replace('Documents', '') || ''} $</span>
            <span className="text-blue-200">{line.cmd}</span>
          </div>
          {line.output && <div className="mt-1 pl-4 mb-2">{line.output}</div>}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <span className="text-white font-medium opacity-80">macbook-pro</span>
        <span className="text-blue-400">~{currentPath.replace('Documents', '') || ''} $</span>
        <form onSubmit={(e) => { e.preventDefault(); executeCommand(input); }} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-blue-200 w-full p-0 font-mono"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalContent;
