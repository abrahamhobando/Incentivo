import {
  DefaultPropsProvider_default,
  _extends,
  init_DefaultPropsProvider,
  init_extends,
  require_prop_types,
  useDefaultProps
} from "./chunk-JKMBHKGT.js";
import {
  require_jsx_runtime
} from "./chunk-EQBN7CGY.js";
import {
  __esm,
  __toESM,
  require_react
} from "./chunk-WDOU5HIJ.js";

// node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js
function DefaultPropsProvider(props) {
  return (0, import_jsx_runtime.jsx)(DefaultPropsProvider_default, _extends({}, props));
}
function useDefaultProps2(params) {
  return useDefaultProps(params);
}
var React, import_prop_types, import_jsx_runtime;
var init_DefaultPropsProvider2 = __esm({
  "node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js"() {
    "use client";
    init_extends();
    React = __toESM(require_react());
    import_prop_types = __toESM(require_prop_types());
    init_DefaultPropsProvider();
    import_jsx_runtime = __toESM(require_jsx_runtime());
    true ? DefaultPropsProvider.propTypes = {
      // ┌────────────────────────────── Warning ──────────────────────────────┐
      // │ These PropTypes are generated from the TypeScript type definitions. │
      // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
      // └─────────────────────────────────────────────────────────────────────┘
      /**
       * @ignore
       */
      children: import_prop_types.default.node,
      /**
       * @ignore
       */
      value: import_prop_types.default.object.isRequired
    } : void 0;
  }
});

// node_modules/@mui/material/DefaultPropsProvider/index.js
var init_DefaultPropsProvider3 = __esm({
  "node_modules/@mui/material/DefaultPropsProvider/index.js"() {
    init_DefaultPropsProvider2();
  }
});

export {
  useDefaultProps2 as useDefaultProps,
  init_DefaultPropsProvider3 as init_DefaultPropsProvider
};
//# sourceMappingURL=chunk-HKZ42BZA.js.map
