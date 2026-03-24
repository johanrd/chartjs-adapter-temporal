import {
  src_default
} from "./chunk-BPCRHGB3.js";

// src/register.ts
import { _adapters, defaults } from "chart.js";
_adapters._date.override(src_default);
defaults.set("scales.time", {
  time: {
    displayFormats: {
      _scriptable: false,
      _indexable: false
    }
  }
});
//# sourceMappingURL=register.js.map