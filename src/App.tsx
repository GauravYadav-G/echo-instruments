import { useEffect } from "react";
import Echo from "./Echo";

export default function App() {
  useEffect(() => {
    document.title = "Echo® — Acoustic Instruments, Berlin / Tokyo";
  }, []);

  return <Echo />;
}
