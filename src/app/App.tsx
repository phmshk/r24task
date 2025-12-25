import { PlateCanvas } from "@/modules/PlateCanvas";
import { Sidebar } from "@/modules/Sidebar";

function App() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-2 p-4 lg:grid-cols-[1.1fr_1fr] lg:p-6">
        <div className="flex h-[50vh] w-full items-center justify-center overflow-hidden rounded-3xl bg-black transition-all lg:sticky lg:top-4 lg:h-[calc(100vh-4rem)] lg:shadow-xl">
          <PlateCanvas />
        </div>

        <div className="w-full min-w-0 px-2 py-4 lg:mb-40">
          <Sidebar />
        </div>
      </section>
    </main>
  );
}
export default App;
