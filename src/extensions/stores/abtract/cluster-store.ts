import { ObservableMap } from "mobx";
import { ClusterId, ClusterModel, ClusterStore } from "../../../common/cluster-store";
import { Cluster } from "../../../main/cluster";
import { Singleton } from "../../core-api/utils";

/**
 * Stores all clusters
 *
 * @beta
 */
export abstract class ClusterStoreAbstract extends Singleton {
  protected constructor(private internalClusterStore: ClusterStore) {
    super();
  }

  /**
   * Active cluster id
   */
  get activeClusterId(): string {
    return this.internalClusterStore.activeClusterId;
  }

  /**
   * Map of all clusters
   */
  get clusters(): ObservableMap<string, Cluster> {
    return this.internalClusterStore.clusters;
  }

  /**
   * Get active cluster (a cluster which is currently visible)
   */
  get activeCluster(): Cluster | null {
    return this.internalClusterStore.active;
  }

  /**
   * Array of all clusters
   */
  get clustersList(): Cluster[] {
    return this.internalClusterStore.clustersList;
  }

  /**
   * Array of all enabled clusters
   */
  get enabledClustersList(): Cluster[] {
    return this.internalClusterStore.enabledClustersList;
  }

  /**
   * Array of all clusters that have active connection to a Kubernetes cluster
   */
  get connectedClustersList(): Cluster[] {
    return this.internalClusterStore.connectedClustersList;
  }

  /**
   * Makes the clusterID active, and switches the main view to it
   * @param clusterId cluster id
   */
  setActive(clusterId: ClusterId): void {
    this.internalClusterStore.setActive(clusterId);
  }

  /**
   * Get cluster object by cluster id
   * @param id cluster id
   */
  getById(id: ClusterId): Cluster {
    return this.internalClusterStore.getById(id);
  }

  /**
   * Get all clusters belonging to a workspace
   * @param workspaceId workspace id
   */
  getByWorkspaceId(workspaceId: string): Cluster[] {
    return this.internalClusterStore.getByWorkspaceId(workspaceId);
  }

  /**
   * Add clusters to store
   * @param models list of cluster models
   */
  addClusters(...models: ClusterModel[]): Cluster[] {
    return this.internalClusterStore.addClusters(...models);
  }

  /**
   * Add a cluster to store
   * @param model cluster
   */
  addCluster(model: ClusterModel | Cluster): Cluster {
    return this.internalClusterStore.addCluster(model);
  }

  /**
   * Remove a cluster from store
   * @param model cluster
   */
  async removeCluster(model: ClusterModel) {
    return this.internalClusterStore.removeCluster(model);
  }

  /**
   * Remove a cluster from store by id
   * @param clusterId cluster id
   */
  async removeById(clusterId: ClusterId) {
    return this.internalClusterStore.removeById(clusterId);
  }

  /**
   * Remove all clusters belonging to a workspaces
   * @param workspaceId workspace id
   */
  removeByWorkspaceId(workspaceId: string) {
    return this.internalClusterStore.removeByWorkspaceId(workspaceId);
  }
}
