import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { workspacesURL } from "../../+workspaces";
import { Cluster } from "../../../../main/cluster";
import { Select } from "../../../components/select";
import { SubTitle } from "../../layout/sub-title";
import { workspaceStore } from "../../../stores";

interface Props {
  cluster: Cluster;
}

@observer
export class ClusterWorkspaceSetting extends React.Component<Props> {
  render() {
    return (
      <>
        <SubTitle title="Cluster Workspace"/>
        <p>
          Define cluster{" "}
          <Link to={workspacesURL()}>
            workspace
          </Link>.
        </p>
        <Select
          value={this.props.cluster.workspace}
          onChange={({value}) => this.props.cluster.workspace = value}
          options={workspaceStore.enabledWorkspacesList.map(w =>
            ({value: w.id, label: w.name})
          )}
        />
      </>
    );
  }
}
