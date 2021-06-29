import logo from './logo.svg';
import './App.css';
import DateSelector from "./components/dateselector";
import ClosedDateTimeline from "./components/closeddatetimeline"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="mainbody">
        <ClosedDateTimeline />
        <DateSelector />
      </div>
    </div>
  );
}

export default App;
