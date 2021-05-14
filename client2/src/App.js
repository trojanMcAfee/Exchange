import './App.scss';
import Wallet from './components/Wallet';
import Transfer from './components/Transfer';

function App() {
  return (
    <div className="components">
      <Wallet id='wallet'/>

      <Transfer id='transfer'/>
    </div>
  );
}

export default App;
