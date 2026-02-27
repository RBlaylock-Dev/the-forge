import { ForgeCanvas } from '@/canvas/ForgeCanvas';
import { StartOverlay } from '@/hud/StartOverlay';
import { TopBar } from '@/hud/TopBar';

export default function Home() {
  return (
    <>
      <ForgeCanvas />
      <TopBar />
      <StartOverlay />
    </>
  );
}
