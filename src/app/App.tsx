import { PlateCanvas } from "@/modules/PlateCanvas";
import { Sidebar } from "@/modules/Sidebar";

function App() {
  return (
    <main className="flex h-screen w-full flex-col">
      <section className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8 p-8 lg:flex-row">
        <div className="my-8 flex flex-1 items-center justify-center rounded-2xl bg-black p-8">
          <PlateCanvas />
        </div>
        <div className="my-8 flex-1">
          <Sidebar />
        </div>
      </section>
    </main>
  );
}

export default App;
