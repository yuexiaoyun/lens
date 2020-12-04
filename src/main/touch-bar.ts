import path from "path";
import { isDevelopment } from "../common/vars";
import { app, BrowserWindow, ipcMain, TouchBar } from "electron";
import { broadcastMessage, subscribeToBroadcast } from "../common/ipc";
import { IDockTab } from "../renderer/components/dock/dock.store";

// let bar = new TouchBar(null);

let touchBar: TouchBar;

function getIcon(filename: string) {
  return path.resolve(
    __static,
    isDevelopment ? "../build/touchbar" : "icons", // copied within electron-builder extras
    filename
  );
}

function getDashboardTouchBar() {
  const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

  const historyBack = new TouchBarButton({
    icon: getIcon("back.png")
  });
  const historyForward = new TouchBarButton({
    label: "⭢"
  });
  const terminal = new TouchBarButton({
    label: "T"
  });
  const createResource = new TouchBarButton({
    label: "+",
    backgroundColor: "#3d90ce"
  });

  return new TouchBar({
    items: [
      historyBack,
      historyForward,
      new TouchBarSpacer({ size: "flexible" }),
      terminal,
      createResource
    ]
  });
}

function getDockTouchBar(dockTabs: IDockTab[]) {
  const { TouchBarLabel, TouchBarButton, TouchBarScrubber } = TouchBar;

  // TODO: add tab icons
  const tabs = new TouchBarScrubber({
    items: dockTabs.map(tab => ({ label: tab.title })),
    selectedStyle: "outline",
    continuous: false,
    select: (selectedIndex) => {
      broadcastMessage("select-dock-tab", selectedIndex);
    }
  });
  const closeAll = new TouchBarButton({
    label: "Close All",
    backgroundColor: "#e85555",
    click: () => {
      broadcastMessage("close-all-dock-tabs");
    }
  });

  return new TouchBar({
    items: [
      new TouchBarLabel({ label: "Tabs" }),
      tabs,
      closeAll
    ]
  });
}

function subscribeToEvents(window: BrowserWindow) {
  ipcMain.handle("set-dock-touchbar", (event, dockTabs: IDockTab[]) => {
    const touchBar = getDockTouchBar(dockTabs);

    window.setTouchBar(touchBar);
  });

  ipcMain.handle("set-general-touchbar", () => {
    const touchBar = getDashboardTouchBar();

    window.setTouchBar(touchBar);
  });
}

export function initTouchBar(window: BrowserWindow) {
  // touchBar = getDockTouchBar();
  subscribeToEvents(window);
  touchBar = getDashboardTouchBar();

  window.setTouchBar(touchBar);
}
