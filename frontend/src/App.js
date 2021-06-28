import logo from './logo.svg';
import './App.css';
import DateSelector from "./components/dateselector";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <DateSelector />
      </header>

    </div>
  );
}

export default App;
