import mockFs from "mock-fs";
import { Workspace } from "../../../common/workspace-store";
import { WorkspaceStoreMain } from "../../stores";

jest.mock("electron", () => {
  return {
    app: {
      getVersion: () => "99.99.99",
      getPath: () => "tmp",
      getLocale: () => "en"
    },
    ipcMain: {
      handle: jest.fn(),
      on: jest.fn()
    }
  };
});

describe("workspace store tests", () => {
  describe("for an empty config", () => {
    beforeEach(async () => {
      WorkspaceStoreMain.resetInstance();
      mockFs({ tmp: { "lens-workspace-store.json": "{}" } });

      await WorkspaceStoreMain.getInstance<WorkspaceStoreMain>().load();
    });

    afterEach(() => {
      mockFs.restore();
    });

    it("default workspace should always exist", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      expect(ws.workspaces.size).toBe(1);
      expect(ws.getById(WorkspaceStoreMain.defaultId)).not.toBe(null);
    });

    it("cannot remove the default workspace", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      expect(() => ws.removeWorkspaceById(WorkspaceStoreMain.defaultId)).toThrowError("Cannot remove");
    });

    it("can update workspace description", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();
      const workspace = ws.addWorkspace(new Workspace({
        id: "foobar",
        name: "foobar",
      }));

      workspace.description = "Foobar description";
      ws.updateWorkspace(workspace);

      expect(ws.getById("foobar").description).toBe("Foobar description");
    });

    it("can add workspaces", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      ws.addWorkspace(new Workspace({
        id: "123",
        name: "foobar",
      }));

      const workspace = ws.getById("123");

      expect(workspace.name).toBe("foobar");
      expect(workspace.enabled).toBe(true);
    });

    it("cannot set a non-existent workspace to be active", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      expect(() => ws.setActive("abc")).toThrow("doesn't exist");
    });

    it("can set a existent workspace to be active", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      ws.addWorkspace(new Workspace({
        id: "abc",
        name: "foobar",
      }));

      expect(() => ws.setActive("abc")).not.toThrowError();
    });

    it("can remove a workspace", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      ws.addWorkspace(new Workspace({
        id: "123",
        name: "foobar",
      }));
      ws.addWorkspace(new Workspace({
        id: "1234",
        name: "foobar 1",
      }));
      ws.removeWorkspaceById("123");

      expect(ws.workspaces.size).toBe(2);
    });

    it("cannot create workspace with existent name", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      ws.addWorkspace(new Workspace({
        id: "someid",
        name: "default",
      }));

      expect(ws.workspacesList.length).toBe(1);  // default workspace only
    });

    it("cannot create workspace with empty name", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      ws.addWorkspace(new Workspace({
        id: "random",
        name: "",
      }));

      expect(ws.workspacesList.length).toBe(1);  // default workspace only
    });

    it("cannot create workspace with ' ' name", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      ws.addWorkspace(new Workspace({
        id: "random",
        name: " ",
      }));

      expect(ws.workspacesList.length).toBe(1);  // default workspace only
    });

    it("trim workspace name", () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      ws.addWorkspace(new Workspace({
        id: "random",
        name: "default ",
      }));

      expect(ws.workspacesList.length).toBe(1);  // default workspace only
    });
  });

  describe("for a non-empty config", () => {
    beforeEach(async () => {
      WorkspaceStoreMain.resetInstance();
      mockFs({
        tmp: {
          "lens-workspace-store.json": JSON.stringify({
            currentWorkspace: "abc",
            workspaces: [{
              id: "abc",
              name: "test"
            }, {
              id: "default",
              name: "default"
            }]
          })
        }
      });

      await WorkspaceStoreMain.getInstance<WorkspaceStoreMain>().load();
    });

    afterEach(() => {
      mockFs.restore();
    });

    it("doesn't revert to default workspace", async () => {
      const ws = WorkspaceStoreMain.getInstance<WorkspaceStoreMain>();

      expect(ws.currentWorkspaceId).toBe("abc");
    });
  });
});
