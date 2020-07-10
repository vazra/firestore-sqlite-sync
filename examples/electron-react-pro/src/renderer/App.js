import React from 'react';
import Navbar from './components/Navbar';
import Custom from './components/Custom';
import './custom.css';
import { BackboneProvider } from './providers/BackboneProvider';
import IPCTest from './components/IPCTest';
function App() {
    return (<BackboneProvider>
      <Navbar />
      <IPCTest />
      <Custom />
    </BackboneProvider>);
}
export default App;
// if (module.hot) {
//   module.hot.accept();
// }
//# sourceMappingURL=App.js.map