import { action } from "mobx";
import { requestMain } from "../../common/ipc";
import { internal_WorkspaceStateSync, WorkspaceId, WorkspaceStore } from "../../common/workspace-store";
import logger from "../../main/logger";
import { clusterStore } from "./cluster-store";

export class WorkspaceStoreRenderer extends WorkspaceStore {
  @action
  removeWorkspaceById(id: WorkspaceId) {
    super.removeWorkspaceById(id);
    clusterStore.removeByWorkspaceId(id);
  }

  async load(): Promise<void>{
    await super.load();

    logger.info("[WORKSPACE-STORE] requesting initial state sync");
    const workspaceStates: internal_WorkspaceStateSync[] = await requestMain(WorkspaceStore.stateRequestChannel);

    workspaceStates.forEach((workspaceState) => {
      this.getById(workspaceState.id)?.setState(workspaceState.state);
    });
  }
}

export const workspaceStore = WorkspaceStoreRenderer.getInstance<WorkspaceStoreRenderer>();
