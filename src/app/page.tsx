import { ForgeCanvas } from '@/canvas/ForgeCanvas';
import { StartOverlay } from '@/hud/StartOverlay';
import { TopBar } from '@/hud/TopBar';
import { ZoneFlash } from '@/hud/ZoneFlash';
import { XPBar } from '@/hud/XPBar';

export default function Home() {
  return (
    <>
      <ForgeCanvas />
      <TopBar />
      <XPBar />
      <ZoneFlash />
      <StartOverlay />
    </>
  );
}
