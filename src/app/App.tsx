import { PlateCanvas } from "@/modules/PlateCanvas";

function App() {
  return (
    <div className="flex flex-col h-screen w-full">
      <section className="max-w-7xl mx-auto w-full flex h-full flex-col lg:flex-row">
        <div className="flex-2 bg-black m-8 p-8 rounded-2xl flex items-center justify-center">
          <PlateCanvas />
        </div>
        <div className="flex-1">Right Side With Sidebar</div>
      </section>
    </div>
  );
}

export default App;
