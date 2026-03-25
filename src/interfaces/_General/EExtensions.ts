import IconAvif from '@/assets/icons/extensions/avif.svg'
import IconWebp from '@/assets/icons/extensions/webp.svg'
import IconSvg from '@/assets/icons/extensions/svg.svg'
import IconPng from '@/assets/icons/extensions/png.svg'
import IconJpg from '@/assets/icons/extensions/jpg.svg'

export interface IExtensionData {
  icon: any
}

export const supportedExtensions: Record<string, IExtensionData> = {
  avif: {
    icon: IconAvif,
  },
  webp: {
    icon: IconWebp,
  },
  png: {
    icon: IconPng,
  },
  jpg: {
    icon: IconJpg,
  },
}
