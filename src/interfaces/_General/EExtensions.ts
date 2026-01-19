import IconAvif from '@/assets/icons/extensions/avif.svg'
import IconWebp from '@/assets/icons/extensions/webp.svg'
import IconSvg from '@/assets/icons/extensions/svg.svg'
import IconPng from '@/assets/icons/extensions/png.svg'
import IconJpg from '@/assets/icons/extensions/jpg.svg'

export enum EExtensions {
  AVIF = 'avif',
  WEBP = 'webp',
  SVG = 'svg',
  PNG = 'png',
  JPG = 'jpg',
}

export const extensionIconMap: Record<EExtensions, any> = {
  [EExtensions.AVIF]: IconAvif,
  [EExtensions.WEBP]: IconWebp,
  [EExtensions.SVG]: IconSvg,
  [EExtensions.PNG]: IconPng,
  [EExtensions.JPG]: IconJpg,
}
