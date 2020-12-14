import { workspaceStore as internalWorkspaceStore } from "../../../renderer/stores/workspace-store";
import { WorkspaceStoreAbstract } from "../abtract/workspace-store";

/**
 * Stores all workspaces
 *
 * @beta
 */
export class WorkspaceStore extends WorkspaceStoreAbstract {
  protected constructor() {
    super(internalWorkspaceStore);
  }
}

export const workspaceStore = WorkspaceStore.getInstance<WorkspaceStore>();
