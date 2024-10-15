import "./App.css";

function App() {
  return (
    <>
      <iframe
        src="http://127.0.0.1:5500/index-v2.0.2.html"
        title="Vite React Example"
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          border: 0,
          overflow: "hidden",
          top: 0,
          left: 0,
        }}
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
    </>
  );
}

export default App;
