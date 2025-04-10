import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import TemperaturesPage from "@/pages/Temperature";
import CO2Page from "@/pages/CO2";
import MethanePage from "@/pages/methane";
import PolarIcePage from "@/pages/polarIce";
import NitrousPage from "@/pages/NitrousOxide";
import AboutPage from "@/pages/about";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<TemperaturesPage />} path="/temperatures" />
      <Route element={<CO2Page />} path="/CO2" />
      <Route element={<MethanePage />} path="/methane" />
      <Route element={<NitrousPage />} path="/Nitrous-Oxide" />
      <Route element={<PolarIcePage />} path="/polar-ice" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
