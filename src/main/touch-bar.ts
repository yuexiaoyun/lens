import { app, BrowserWindow, ipcMain, TouchBar } from "electron";
import { broadcastMessage, subscribeToBroadcast } from "../common/ipc";

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
  const { TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarScrubber } = TouchBar;
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

export function initTouchBar(window: BrowserWindow) {
  // touchBar = getDockTouchBar();
  touchBar = getDashboardTouchBar();

  window.setTouchBar(touchBar);
}
