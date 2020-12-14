import { ObservableMap } from "mobx";
import { WorkspaceStore as InternalWorkspaceStore, Workspace, WorkspaceId, WorkspaceStore } from "../../../common/workspace-store";
import { Singleton } from "../../core-api/utils";

/**
 * Stores all workspaces
 *
 * @beta
 */
export abstract class WorkspaceStoreAbstract extends Singleton {
  /**
   * Default workspace id, this workspace is always present
   */
  static readonly defaultId: WorkspaceId = InternalWorkspaceStore.defaultId;

  protected constructor(private internalWorkspaceStore: WorkspaceStore) {
    super();
  }

  /**
   * Currently active workspace id
   */
  get currentWorkspaceId(): string {
    return this.internalWorkspaceStore.currentWorkspaceId;
  }

  /**
   * Map of all workspaces
   */
  get workspaces(): ObservableMap<string, Workspace> {
    return this.internalWorkspaceStore.workspaces;
  }

  /**
   * Currently active workspace
   */
  get currentWorkspace(): Workspace {
    return this.internalWorkspaceStore.currentWorkspace;
  }

  /**
   * Array of all workspaces
   */
  get workspacesList(): Workspace[] {
    return this.internalWorkspaceStore.workspacesList;
  }

  /**
   * Array of all enabled (visible) workspaces
   */
  get enabledWorkspacesList(): Workspace[] {
    return this.internalWorkspaceStore.enabledWorkspacesList;
  }

  /**
   * Get workspace by id
   * @param id workspace id
   */
  getById(id: WorkspaceId): Workspace {
    return this.internalWorkspaceStore.getById(id);
  }

  /**
   * Get workspace by name
   * @param name workspace name
   */
  getByName(name: string): Workspace {
    return this.internalWorkspaceStore.getByName(name);
  }

  /**
   * Set active workspace
   * @param id workspace id
   */
  setActive(id = WorkspaceStoreAbstract.defaultId) {
    return this.internalWorkspaceStore.setActive(id);
  }

  /**
   * Add a workspace to store
   * @param workspace workspace
   */
  addWorkspace(workspace: Workspace) {
    return this.internalWorkspaceStore.addWorkspace(workspace);
  }

  /**
   * Update a workspace in store
   * @param workspace workspace
   */
  updateWorkspace(workspace: Workspace) {
    return this.internalWorkspaceStore.updateWorkspace(workspace);
  }

  /**
   * Remove workspace from store
   * @param workspace workspace
   */
  removeWorkspace(workspace: Workspace) {
    return this.internalWorkspaceStore.removeWorkspace(workspace);
  }

  /**
   * Remove workspace by id
   * @param id workspace
   */
  removeWorkspaceById(id: WorkspaceId) {
    return this.internalWorkspaceStore.removeWorkspaceById(id);
  }
}
