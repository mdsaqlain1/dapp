import { Toaster } from "sonner";
import Header from "./components/Header";
import { WalletConnect } from "./components/WalletConnect";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center"></Toaster>
        <Header></Header>
        <WalletConnect />
      </div>
    </>
  );
}

export default App;
