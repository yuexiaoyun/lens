import { app, BrowserWindow, ipcMain, TouchBar } from "electron";
import { broadcastMessage, subscribeToBroadcast } from "../common/ipc";
import { IDockTab } from "../renderer/components/dock/dock.store";

// let bar = new TouchBar(null);

let touchBar: TouchBar;

function getDashboardTouchBar() {
  const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

  const historyBack = new TouchBarButton({
    label: "⭠"
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

function getDockTouchBar() {
  const { TouchBarLabel, TouchBarButton, TouchBarScrubber } = TouchBar;
  const tabs = new TouchBarScrubber({
    items: [
      { label: "Terminal 1" },
      { label: "Terminal 2" },
      { label: "Pod logs" },
      { label: "Logs unofuturo" },
      { label: "New Seoul tab" },
      { label: "Create new resource" },
    ],
    selectedStyle: "outline",
    continuous: false
  });
  const closeAll = new TouchBarButton({
    label: "Close All",
    backgroundColor: "#e85555"
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
  const { TouchBarLabel, TouchBarButton, TouchBarScrubber } = TouchBar;

  ipcMain.handle("set-dock-touchbar", (event, dockTabs: IDockTab[]) => {
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
    const bar = new TouchBar({
      items: [
        new TouchBarLabel({ label: "Tabs" }),
        tabs,
        closeAll
      ]
    });

    window.setTouchBar(bar);
  });

  ipcMain.handle("set-general-touchbar", () => {
    const bar = getDashboardTouchBar();

    window.setTouchBar(bar);
  });
}

export function initTouchBar(window: BrowserWindow) {
  // touchBar = getDockTouchBar();
  subscribeToEvents(window);
  touchBar = getDashboardTouchBar();

  window.setTouchBar(touchBar);
}
