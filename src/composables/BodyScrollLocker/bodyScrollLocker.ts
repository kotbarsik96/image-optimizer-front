import { Browser } from '@/utils/Browser'
import { ScrollHelper } from '@/utils/ScrollHelpers'

interface ISavedBodyStyles {
  top?: CSSStyleValue
}

interface IBodyScrollLocker {
  lock(): void

  unlock(): void
}

class BodyScrollLocker implements IBodyScrollLocker {
  /** элементы, которым нужно выставлять padding-right при скрытии скролла у body */
  scrollPaddingElements: HTMLElement[]
  /** сохранённые стили элементов массива scrollPaddingElements, выставленные до скрытия прокрутки */
  savedScrollPaddingElementsData: Map<HTMLElement, { 'padding-right'?: string }>
  /** последняя сохранённая позиция прокрутки страницы */
  lastWindowScrollY: number = 0
  /** сохранённые стили body */
  savedBodyStyles: ISavedBodyStyles

  constructor() {
    this.savedBodyStyles = {
      top: document?.body.style.top,
    }
    this.scrollPaddingElements = [
      document.body,
      // document.querySelector('.header--fixed-back .header__content'),
      // document.querySelector('.header--fixed .header__content')
    ]
    this.savedScrollPaddingElementsData = new Map()

    this.updateScrollPaddingElements()
  }

  public lock() {
    this.saveStyles()

    const scrollbarWidth = ScrollHelper.getScrollbarWidth()
    const paddingRight = document.body.classList.contains('_firefox')
      ? `${scrollbarWidth}px`
      : 'var(--scrollbar-with-space)'
    if (!Browser.isMobile()) {
      this.scrollPaddingElements.forEach((el) => {
        if (!el) return
        ;(el as HTMLElement).style.paddingRight = paddingRight
      })
    }

    this.lastWindowScrollY = window.scrollY
    document.body.classList.add('_no-scroll')
    document.body.style.top = `-${this.lastWindowScrollY}px`
  }

  public unlock() {
    document.body.classList.remove('_no-scroll')

    this.scrollPaddingElements.forEach((el) => {
      if (!el) return
      ;(el as HTMLElement).style.removeProperty('padding-right')
    })

    document.body.style.removeProperty('top')
    window.scrollTo({
      top: this.lastWindowScrollY,
      behavior: 'instant',
    })

    this.restoreStyles()
  }

  private updateScrollPaddingElements() {
    this.scrollPaddingElements.forEach((el) => {
      if (el === document.body) return

      this.savedScrollPaddingElementsData.set(el, {
        'padding-right': el.style.paddingRight,
      })
    })
  }

  private saveStyles() {
    this.savedBodyStyles = {
      top: document.body.style.top,
    }

    this.updateScrollPaddingElements()
  }

  private restoreStyles() {
    Object.entries(this.savedBodyStyles).forEach(([key, value]) => {
      if (value) document.body.style.setProperty(key, value)
      else document.body.style.removeProperty(key)
    })

    this.savedScrollPaddingElementsData.forEach((saved, el) => {
      Object.entries(saved).forEach(([key, value]) => {
        if (value) el.style.setProperty(key, value)
        else el.style.removeProperty(key)
      })
    })
  }
}

class DummyBodyScrollLocker implements IBodyScrollLocker {
  public lock() {}

  public unlock() {}
}

export const bodyScrollLocker =
  typeof window == 'undefined' ? new DummyBodyScrollLocker() : new BodyScrollLocker()
