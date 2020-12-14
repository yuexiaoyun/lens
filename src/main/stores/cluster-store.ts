import { action, reaction } from "mobx";
import { ClusterId, ClusterStore, internal_ClusterStateSync } from "../../common/cluster-store";
import { handleRequest } from "../../common/ipc";
import { clusterViewURL } from "../../renderer/components/cluster-manager/cluster-view.route";
import { WindowManager } from "../window-manager";
import { workspaceStore } from "./workspace-store";

export class ClusterStoreMain extends ClusterStore {
  constructor() {
    super();

    this.pushStateToViewsAutomatically();
  }

  protected pushStateToViewsAutomatically() {
    reaction(() => this.enabledClustersList, () => {
      this.pushState();
    });
    reaction(() => this.connectedClustersList, () => {
      this.pushState();
    });
  }

  async load(): Promise<void> {
    await super.load();

    handleRequest(ClusterStore.stateRequestChannel, (): internal_ClusterStateSync[] => {
      const states: internal_ClusterStateSync[] = [];

      this.clustersList.forEach((cluster) => {
        states.push({
          state: cluster.getState(),
          id: cluster.id
        });
      });

      return states;
    });
  }

  @action
  setActive(clusterId: ClusterId) {
    super.setActive(clusterId);
    workspaceStore.setLastActiveClusterId(clusterId);
    WindowManager.getInstance<WindowManager>().navigate(clusterViewURL({ params: { clusterId } }));
  }
}

export const clusterStore = ClusterStoreMain.getInstance<ClusterStoreMain>();
