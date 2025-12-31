# Plate Configurator (Test Task)

An interactive configurator designed for positioning electrical sockets on mounting plates.

## Live Demo

You can try the live application here: **[\[ ➡️ Live Demo \]](https://r24task-nnuwh.ondigitalocean.app/)**

## Key Features

* **Custom Drag & Drop**: Built from scratch using the Pointer Events API and `setPointerCapture` to ensure stability and touch support.
* **SVG Coordinate System**: Implements precise mapping between DOM pixels and SVG units (cm) to handle scaling correctly.
* **Collision Detection**: A custom algorithm prevents sockets from overlapping or being placed outside the plate boundaries.
* **Auto-placement Logic**: Smart positioning system that finds the nearest available slot for new socket groups.

## Tech Stack

* **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using CSS variables for theming)
* **UI Primitives**: [shadcn/ui](https://ui.shadcn.com/) (Headless accessible components)
* **Icons**: [Lucide React](https://lucide.dev/)

## Run locally

Ensure you have **Node.js** installed (v20+ recommended).

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/phmshk/r24task.git](https://github.com/phmshk/r24task.git)
    cd r24task
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

4.  **Build for production**
    ```bash
    npm run build
    ```
