// App.jsx
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { unblockResources, blockResources } from './utils/cookieManager';

function App() {
  useEffect(() => {
    unblockResources();
    blockResources(); // Blocca nuovamente le risorse non consentite
  }, []);

  return (
    <div className="App">
      <h1>La mia applicazione</h1>
    </div>
  );
}

export default App;
