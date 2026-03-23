import { DateAdapter } from 'chart.js';

interface AdapterOptions {
    locale?: string;
    timeZone?: string;
}
interface FormatContext {
    locale?: string;
    timeZone: string;
}
type FormatValue = string | Intl.DateTimeFormatOptions | ((timestamp: number, context: FormatContext) => string);
declare const adapter: DateAdapter<AdapterOptions>;

export { type AdapterOptions, type FormatContext, type FormatValue, adapter as default };
