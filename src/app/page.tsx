import { ForgeCanvas } from '@/canvas/ForgeCanvas';
import { StartOverlay } from '@/hud/StartOverlay';
import { TopBar } from '@/hud/TopBar';
import { ZoneFlash } from '@/hud/ZoneFlash';
import { XPBar } from '@/hud/XPBar';
import { Crosshair } from '@/hud/Crosshair';
import { InteractPrompt } from '@/hud/InteractPrompt';
import { DetailPanel } from '@/hud/DetailPanel';

export default function Home() {
  return (
    <>
      <ForgeCanvas />
      <TopBar />
      <XPBar />
      <Crosshair />
      <InteractPrompt />
      <DetailPanel />
      <ZoneFlash />
      <StartOverlay />
    </>
  );
}
