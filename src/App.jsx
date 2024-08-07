// App.jsx
import { useEffect } from 'preact/hooks';
import { unblockResources, blockResources } from './utils/cookieManager';

function App() {
  useEffect(() => {
    unblockResources();
    blockResources(); 
  }, []);

  return (
    <div className="App">
      <h1>Testing</h1>
    </div>
  );
}

export default App;
