import './App.css';
import Maps from './components/Maps';
import { MyProvider } from './context/DataContext';
function App() {
  return (
    <div className="App">
      <MyProvider>
        <Maps></Maps>        
      </MyProvider>
    </div>
  );
}

export default App;
