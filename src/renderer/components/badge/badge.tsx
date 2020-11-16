import "./badge.scss"

import React from "react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { cssNames } from "../../utils/cssNames";
import { TooltipDecoratorProps, withTooltip } from "../tooltip";
import { autobind } from "../../utils";

export interface BadgeProps extends React.HTMLAttributes<any>, TooltipDecoratorProps {
  small?: boolean;
  label?: React.ReactNode;
  isExpanded?: boolean; // always force state to this value
}

const badgeMeta = observable({
  hasTextSelected: false,
});

// Common handler for all Badge instances
document.addEventListener("selectionchange", () => {
  badgeMeta.hasTextSelected = window.getSelection().toString().trim().length > 0
});

@withTooltip
@observer
export class Badge extends React.Component<BadgeProps> {
  @observable _isExpanded = false;
  @observable hasHighlightedText = false;
  @observable interval?: NodeJS.Timeout;
  @observable.ref elem?: HTMLElement;

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  @computed get isExpanded() {
    return this.props.isExpanded ?? this._isExpanded
  }

  @computed get isExpandable() {
    console.log(this.elem)
    if (!this.elem) {
      return false
    }

    const { scrollWidth, clientWidth, clientHeight, scrollHeight } = this.elem
    return clientWidth < scrollWidth || clientHeight < scrollHeight
  }

  @autobind()
  setRef(elem: HTMLElement) {
    // This needs to be a seperate function, see: https://github.com/facebook/react/issues/11258
    this.elem = elem
  }

  @autobind()
  onMouseDown() {
    // Calculate once and then again after every 75ms.
    this.hasHighlightedText ||= document.getSelection().toString().length > 0

    // Human reaction time ranges from 150ms to 250ms so every 75ms should be
    // often enough (while not being resource intensive).
    this.interval = setInterval(() => {
      this.hasHighlightedText ||= document.getSelection().toString().length > 0
    }, 75)
  }

  @autobind()
  onMouseUp() {
    clearInterval(this.interval)

    if (!this.hasHighlightedText) {
      this._isExpanded = !this._isExpanded
    }

    this.hasHighlightedText = false
  }

  render() {
    const { className, label, small, children, isExpanded: _, ...elemProps } = this.props;
    const classNames = cssNames("Badge", className, {
      small,
      isExpandable: this.isExpandable,
    })
    const labelClass = cssNames("label-content", {
      isExpanded: this.isExpanded,
    })
    return (
      <div {...elemProps} className={classNames}>
        <div className={labelClass} onMouseUp={this.onMouseUp} onMouseDown={this.onMouseDown} ref={this.setRef}>
          {label}
          {children}
        </div>
      </div>
    )
  }
}
