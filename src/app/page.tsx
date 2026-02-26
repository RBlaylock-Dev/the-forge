export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forge-bg">
      <div className="text-center">
        <h1 className="font-cinzel text-5xl font-black text-forge-wheat mb-4">
          THE FORGE
        </h1>
        <p className="font-rajdhani text-xl text-forge-amber">
          Robert Blaylock — Senior Full Stack & 3D Engineer
        </p>
        <div className="mt-8 h-px w-48 mx-auto bg-gradient-to-r from-transparent via-forge-gold to-transparent" />
        <p className="mt-6 font-rajdhani text-sm text-forge-muted">
          Scaffolding complete. Building the forge...
        </p>
      </div>
    </div>
  );
}
