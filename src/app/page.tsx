import { ForgeCanvas } from '@/canvas/ForgeCanvas';
import { StartOverlay } from '@/hud/StartOverlay';
import { TopBar } from '@/hud/TopBar';
import { ZoneFlash } from '@/hud/ZoneFlash';
import { XPBar } from '@/hud/XPBar';
import { Crosshair } from '@/hud/Crosshair';
import { InteractPrompt } from '@/hud/InteractPrompt';

export default function Home() {
  return (
    <>
      <ForgeCanvas />
      <TopBar />
      <XPBar />
      <Crosshair />
      <InteractPrompt />
      <ZoneFlash />
      <StartOverlay />
    </>
  );
}
