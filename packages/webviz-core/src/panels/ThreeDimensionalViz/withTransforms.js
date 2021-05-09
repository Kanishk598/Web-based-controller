// @flow
//
//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.
//import hoistNonReactStatics from "hoist-non-react-statics";
//import PropTypes from "prop-types";
//import * as React from "react";
//
//import { getGlobalHooks } from "../../loadWebviz";
//import Transforms from "webviz-core/src/panels/ThreeDimensionalViz/Transforms";
//import { updateTransforms } from "webviz-core/src/panels/ThreeDimensionalViz/utils/transformsUtils";
//import type { Frame } from "webviz-core/src/players/types";
//
//function withTransforms<Props: *>(ChildComponent: React.ComponentType<Props>) {
//  function Component(props: { frame: Frame, cleared: boolean, forwardedRef: any }) {
//    const transforms = React.useRef(new Transforms());
//
//    const { frame, cleared } = props;
//    transforms.current = updateTransforms(
//      transforms.current,
//      frame,
//      cleared,
//      getGlobalHooks().perPanelHooks().ThreeDimensionalViz.skipTransformFrame?.frameId,
//      getGlobalHooks().perPanelHooks().ThreeDimensionalViz.consumePose
//    );
//
//    // $FlowFixMe - can't seem to figure out how to properly type this.
//    return <ChildComponent {...props} ref={props.forwardedRef} transforms={transforms.current} />;
//  }
//  Component.displayName = `withTransforms(${ChildComponent.displayName || ChildComponent.name || ""})`;
//  Component.contextTypes = { store: PropTypes.any };
//
//  return hoistNonReactStatics(
//    React.forwardRef((props, ref) => {
//      return <Component {...props} forwardedRef={ref} />;
//    }),
//    ChildComponent
//  );
//}
//
//export default withTransforms;

// @flow
//
//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.
import hoistNonReactStatics from "hoist-non-react-statics";
import PropTypes from "prop-types";
import * as React from "react";

import { getGlobalHooks } from "../../loadWebviz";
import Transforms from "webviz-core/src/panels/ThreeDimensionalViz/Transforms";
import { updateTransforms } from "webviz-core/src/panels/ThreeDimensionalViz/utils/transformsUtils";
import type { Frame } from "webviz-core/src/players/types";

type State = {| transforms: Transforms |};

function withTransforms<Props: *>(ChildComponent: React.ComponentType<Props>) {
  class Component extends React.PureComponent<$Shape<{| frame: Frame, cleared: boolean, forwardedRef: any |}>, State> {
    static displayName = `withTransforms(${ChildComponent.displayName || ChildComponent.name || ""})`;
    static contextTypes = { store: PropTypes.any };

    state: State = { transforms: new Transforms() };

    static getDerivedStateFromProps(nextProps: Props, prevState: State): ?$Shape<State> {
      const { frame, cleared } = nextProps;
      const updatedTransforms = updateTransforms(
        prevState.transforms,
        frame,
        cleared,
        getGlobalHooks().perPanelHooks().ThreeDimensionalViz.skipTransformFrame?.frameId,
        getGlobalHooks().perPanelHooks().ThreeDimensionalViz.consumePose
      );
      return { transforms: updatedTransforms };
    }

    render() {
      // $FlowFixMe - can't seem to figure out how to properly type this.
      return <ChildComponent {...this.props} ref={this.props.forwardedRef} transforms={this.state.transforms} />;
    }
  }

  return hoistNonReactStatics(
    React.forwardRef((props, ref) => <Component {...props} forwardedRef={ref} />),
    ChildComponent
  );
}

export default withTransforms;