"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_chart = require("chart.js");
var FORMAT_OPTIONS = {
  datetime: { dateStyle: "medium", timeStyle: "medium" },
  millisecond: {
    fractionalSecondDigits: 3,
    second: "numeric",
    minute: "numeric",
    hour: "numeric"
  },
  second: {
    second: "numeric",
    minute: "numeric",
    hour: "numeric"
  },
  minute: { hour: "numeric", minute: "numeric" },
  hour: { hour: "numeric", minute: "numeric" },
  day: { day: "numeric", month: "short" },
  week: { day: "numeric", month: "short" },
  month: { month: "short", year: "numeric" },
  year: { year: "numeric" }
};
var FORMATS = {
  datetime: "datetime",
  millisecond: "millisecond",
  second: "second",
  minute: "minute",
  hour: "hour",
  day: "day",
  week: "week",
  month: "month",
  quarter: "quarter",
  year: "year"
};
var units = [
  "millisecond",
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "year"
];
var cache = /* @__PURE__ */ new Map();
function getTimeZone(options) {
  return options.timeZone ?? Temporal.Now.timeZoneId();
}
var adapter = {
  options: {},
  init(chartOptions) {
    if (chartOptions.locale) {
      this.options.locale = chartOptions.locale;
    }
  },
  formats() {
    return FORMATS;
  },
  format(timestamp, format) {
    const timeZone = getTimeZone(this.options);
    if (typeof format === "function") {
      return format(timestamp, { locale: this.options.locale, timeZone });
    }
    if (format === FORMATS.quarter) {
      const q = Math.floor(
        Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(timeZone).month / 3
      ) + 1;
      return `Q${q} - ${this.format(timestamp, FORMATS.year)}`;
    }
    const options = typeof format === "string" ? FORMAT_OPTIONS[format] : format;
    const key = `${this.options.locale}:${timeZone}:${typeof format === "string" ? format : JSON.stringify(format)}`;
    let formatter = cache.get(key);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(this.options.locale, { ...options, timeZone });
      cache.set(key, formatter);
    }
    return formatter.format(timestamp);
  },
  parse(value) {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      try {
        return Temporal.Instant.from(value).epochMilliseconds;
      } catch {
        try {
          return Temporal.PlainDateTime.from(value).toZonedDateTime(getTimeZone(this.options)).epochMilliseconds;
        } catch {
        }
      }
    }
    throw new Error(`Not a date: ${JSON.stringify(value)}`);
  },
  add(timestamp, amount, unit) {
    if (unit === "quarter") {
      amount *= 3;
      unit = "month";
    }
    const temporalUnit = `${unit}s`;
    return Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(getTimeZone(this.options)).add({ [temporalUnit]: amount }).epochMilliseconds;
  },
  diff(a, b, unit) {
    if (unit === "quarter") {
      return Math.floor(this.diff(a, b, "month") / 3);
    }
    const temporalUnit = `${unit}s`;
    const _a = Temporal.Instant.fromEpochMilliseconds(a).toZonedDateTimeISO(
      getTimeZone(this.options)
    );
    const _b = Temporal.Instant.fromEpochMilliseconds(b).toZonedDateTimeISO(
      getTimeZone(this.options)
    );
    return _a.since(_b, { largestUnit: temporalUnit })[temporalUnit];
  },
  startOf(timestamp, unit) {
    return startOf(timestamp, unit, this.options).epochMilliseconds;
  },
  endOf(timestamp, unit) {
    const start = startOf(timestamp, unit, this.options);
    if (unit === "isoWeek" || unit === "week") {
      return start.add({ days: 7 }).epochMilliseconds;
    }
    if (unit === "quarter") {
      return start.add({ months: 3 }).epochMilliseconds;
    }
    const temporalUnit = `${unit}s`;
    return start.add({ [temporalUnit]: 1 }).epochMilliseconds;
  }
};
var src_default = adapter;
function startOf(_ts, unit, options) {
  const ts = Temporal.Instant.fromEpochMilliseconds(_ts).toZonedDateTimeISO(getTimeZone(options));
  if (unit === "millisecond") {
    return ts;
  }
  if (unit === "isoWeek" || unit === "week") {
    const startOfDay = ts.startOfDay();
    return startOfDay.subtract({
      days: startOfDay.dayOfWeek - 1
    });
  }
  if (unit === "quarter") {
    const startOfMonth = startOf(_ts, "month", options);
    const quarter = Math.floor(startOfMonth.month / 3);
    return startOfMonth.with({ month: quarter * 3 + 1 });
  }
  const index = units.indexOf(unit);
  const resetUnits = Object.fromEntries(
    units.slice(0, index).map((u) => [u, u === "day" || u === "month" ? 1 : 0])
  );
  return ts.with(resetUnits);
}
//# sourceMappingURL=index.cjs.map