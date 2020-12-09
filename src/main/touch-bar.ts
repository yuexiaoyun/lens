import path from "path";
import { isDevelopment } from "../common/vars";
import { BrowserWindow, ipcMain, NativeImage, nativeImage, TouchBar, TouchBarGroup } from "electron";
import { broadcastMessage } from "../common/ipc";
import { IDockTab } from "../renderer/components/dock/dock.store";

export enum TouchChannels {
  SetTouchBar = "touchbar:set-touch-bar",
  SetDockBar = "touchbar:set-dock-bar",
  SetPodsBar = "touchbar:set-pods-bar",
  SelectDockTab = "touchbar:select-dock-tab",
  CloseAllDockTabs = "touchbar:close-all-dock-tabs",
  OpenCreateResouce = "touchbar:open-create-resource-tab",
  OpenTerminal = "touchbar:open-terminal-tab"
}

function getIcon(filename: string): NativeImage {
  const filePath = path.resolve(
    __static,
    isDevelopment ? "../build/touchbar" : "icons", // copied within electron-builder extras
    filename
  );

  return nativeImage.createFromPath(filePath);
}

function getDashboardTouchBar(centralGroup?: TouchBarGroup) {
  const { TouchBarSpacer, TouchBarSegmentedControl, TouchBarButton } = TouchBar;
  const historySegment = new TouchBarSegmentedControl({
    mode: "buttons",
    segments: [
      { icon: getIcon("back.png") },
      { label: "->" }
    ],
    change: (selectedIndex) => {
      const direction = selectedIndex == 0 ? "back" : "forward";

      broadcastMessage("renderer:navigate-history", direction);
    }
  });

  const dockSegment = new TouchBarSegmentedControl({
    mode: "buttons",
    segments: [
      { label: "T" },
      { label: "+" }
    ],
    change: (selectedIndex) => {
      const tab = selectedIndex == 0 ? TouchChannels.OpenTerminal : TouchChannels.OpenCreateResouce;

      broadcastMessage(tab);
    }
  });

  return new TouchBar({
    items: [
      historySegment,
      centralGroup || new TouchBarSpacer({ size: "flexible" }),
      dockSegment
    ]
  });
}

function getDockTouchBar(dockTabs: IDockTab[]) {
  const { TouchBarButton, TouchBarScrubber, TouchBarLabel } = TouchBar;
  // TODO: add tab icons
  const tabs = new TouchBarScrubber({
    items: dockTabs.map(tab => ({ label: tab.title })),
    selectedStyle: "outline",
    continuous: false,
    select: (selectedIndex) => {
      broadcastMessage(TouchChannels.SelectDockTab, selectedIndex);
    }
  });
  const closeAll = new TouchBarButton({
    label: "Close All",
    backgroundColor: "#e85555",
    click: () => {
      broadcastMessage("close-all-dock-tabs");
    }
  });
  const esc = new TouchBarButton({
    label: "esc",
    click: () => broadcastMessage(TouchChannels.SetTouchBar)
  });

  return new TouchBar({
    items: [
      new TouchBarLabel({ label: "Tabs" }),
      tabs,
      closeAll
    ],
    escapeItem: esc
  });
}

function getPodsTouchBar(statuses: { [key: string]: number }) {
  const items = Object.entries(statuses).map(([key, value]) => {
    // TODO: Add status icons
    return {
      label: `${key}: ${value}`
    };
  });
  const tabs = new TouchBar.TouchBarScrubber({
    items,
    selectedStyle: "none",
    continuous: false,
  });

  return getDashboardTouchBar(tabs);
}

function setTouchBar(window: BrowserWindow, touchBar: TouchBar) {
  window.setTouchBar(touchBar);
}

function subscribeToEvents(window: BrowserWindow) {
  ipcMain.handle(TouchChannels.SetTouchBar, () => {
    setTouchBar(window, getDashboardTouchBar());
  });

  ipcMain.handle(TouchChannels.SetDockBar, (event, dockTabs: IDockTab[]) => {
    const touchBar = getDockTouchBar(dockTabs);

    window.setTouchBar(touchBar);
  });

  ipcMain.handle(TouchChannels.SetPodsBar, (event, podStatuses: { [key: string]: number }) => {
    const touchBar = getPodsTouchBar(podStatuses);

    setTouchBar(window, touchBar);
  });
}

export function initTouchBar(window: BrowserWindow) {
  subscribeToEvents(window);
  setTouchBar(window, getDashboardTouchBar());
}
