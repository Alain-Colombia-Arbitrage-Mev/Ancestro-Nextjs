import { CDN_URL } from '@/lib/cdn';

const ASSET_V = 2;

export const IMG = `${CDN_URL}/energy-home`;
export const FLAGS = `${CDN_URL}/images/flags`;

export const imgUrl = (name: string) => `${IMG}/${name}?v=${ASSET_V}`;
export const bgUrl = (name: string) => `${IMG}/${name}?v=${ASSET_V}`;
