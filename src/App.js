import { React } from 'react';
import Footer from './Component/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Presale from './Component/presale/Presale';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";


function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Routes>
            <Route path='/' element={<Presale />} />
          </Routes>
        </Web3ReactProvider>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
