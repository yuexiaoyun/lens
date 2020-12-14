import { action } from "mobx";
import { handleRequest } from "../../common/ipc";
import { internal_WorkspaceStateSync, WorkspaceId, WorkspaceStore } from "../../common/workspace-store";
import { clusterStore } from "./cluster-store";

export class WorkspaceStoreMain extends WorkspaceStore {
  @action
  removeWorkspaceById(id: WorkspaceId) {
    super.removeWorkspaceById(id);
    clusterStore.removeByWorkspaceId(id);
  }

  async load(): Promise<void> {
    await super.load();

    handleRequest(WorkspaceStore.stateRequestChannel, (): internal_WorkspaceStateSync[] => {
      const states: internal_WorkspaceStateSync[] = [];

      this.workspacesList.forEach((workspace) => {
        states.push({
          state: workspace.getState(),
          id: workspace.id
        });
      });

      return states;
    });
  }
}

export const workspaceStore = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();
