/// <reference path="./types.d.ts" />

import deepSeek from "./src/language/deepSeek";
import cheapAiModel from "./src/language/cheapAiModel";
import apiMart from "./src/media/apiMart";
import metaso from "./src/media/metaso";
import compshare from "./src/media/compshare";
import waveSpeed from "./src/media/waveSpeed";
import edgeTts from "./src/media/edgeTts";

export type Provider = ProviderDefinition;
export type ProviderPrice = NonNullable<Awaited<ReturnType<NonNullable<Provider["getPrice"]>>>>;
export type ProviderPriceRequest = Parameters<NonNullable<Provider["getPrice"]>>[0];
export type ProviderPriceReference = NonNullable<ProviderPriceRequest["images"]>[number];
export type ProviderBalance = Awaited<ReturnType<NonNullable<Provider["getBalance"]>>>;
export type ProviderTools = ProviderContext["tool"];
export type ProviderTaskData = Parameters<NonNullable<ProviderContext["saveTaskData"]>>[0];
export type AudioConvertOptions = Parameters<ProviderTools["audio"]["convert"]>[1];
export type EdgeTtsOptions = Parameters<ProviderTools["edgeTts"]>[0];
export type { FfmpegFactory, FfmpegCommand } from "@toonflow/ffmpeg/types";

export const languageProviders = [deepSeek, cheapAiModel] as const;
export const mediaProviders = [edgeTts, apiMart, metaso, compshare, waveSpeed] as const;
