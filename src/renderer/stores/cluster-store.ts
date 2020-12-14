import { action } from "mobx";
import { ClusterId, ClusterStore, getClusterIdFromHost, internal_ClusterStateSync } from "../../common/cluster-store";
import { requestMain } from "../../common/ipc";
import { Cluster } from "../../main/cluster";
import logger from "../../main/logger";
import { clusterViewURL } from "../components/cluster-manager/cluster-view.route";
import { navigate } from "../navigation";
import { workspaceStore } from "./workspace-store";

export class ClusterStoreRenderer extends ClusterStore {
  async load(): Promise<void> {
    await super.load();

    logger.info("[CLUSTER-STORE] requesting initial state sync");
    const clusterStates: internal_ClusterStateSync[] = await requestMain(ClusterStore.stateRequestChannel);

    clusterStates.forEach((clusterState) => {
      this.getById(clusterState.id)?.setState(clusterState.state);
    });
  }

  @action
  setActive(clusterId: ClusterId) {
    super.setActive(clusterId);
    workspaceStore.setLastActiveClusterId(clusterId);
    navigate(clusterViewURL({ params: { clusterId } }));
  }
}

export const clusterStore = ClusterStoreRenderer.getInstance<ClusterStoreRenderer>();

export function getClusterFrameUrl(clusterId: ClusterId) {
  return `//${clusterId}.${location.host}`;
}

export function getHostedClusterId() {
  return getClusterIdFromHost(location.hostname);
}

export function getHostedCluster(): Cluster {
  return clusterStore.getById(getHostedClusterId());
}
