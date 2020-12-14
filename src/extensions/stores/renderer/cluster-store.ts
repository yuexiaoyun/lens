import { clusterStore as internalClusterStore } from "../../../renderer/stores/cluster-store";
import { ClusterStoreAbstract } from "../abtract/cluster-store";

/**
 * Stores all clusters
 *
 * @beta
 */
export class ClusterStore extends ClusterStoreAbstract {
  protected constructor() {
    super(internalClusterStore);
  }
}

export const clusterStore = ClusterStore.getInstance<ClusterStore>();
