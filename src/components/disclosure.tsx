import type { KeyboardEvent, ReactNode } from "react"
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"

type AccordionProps = {
  readonly children: ReactNode
  readonly defaultExpanded?: boolean
  readonly disabled?: boolean
  readonly id: string
  readonly title: string
}

export function Accordion({
  children,
  defaultExpanded = false,
  disabled = false,
  id,
  title,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const triggerId = `${id}-trigger`
  const panelId = `${id}-panel`

  return (
    <section className="accordion">
      <h3>
        <button
          aria-controls={panelId}
          aria-expanded={expanded}
          className="accordion__trigger"
          disabled={disabled}
          id={triggerId}
          onClick={() => setExpanded((current) => !current)}
          type="button"
        >
          {title}
        </button>
      </h3>
      <section
        aria-labelledby={triggerId}
        className="accordion__panel"
        hidden={!expanded}
        id={panelId}
      >
        {children}
      </section>
    </section>
  )
}

type DrawerProps = {
  readonly appRootId?: string
  readonly children: ReactNode
  readonly description: string
  readonly title: string
}

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",")

export function Drawer({ appRootId = "root", children, description, title }: DrawerProps) {
  const titleId = useId()
  const descriptionId = useId()
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const appRoot = document.getElementById(appRootId)
    const trigger = triggerRef.current
    appRoot?.setAttribute("inert", "")
    closeRef.current?.focus()

    return () => {
      appRoot?.removeAttribute("inert")
      trigger?.focus()
    }
  }, [appRootId, open])

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      return
    }

    if (event.key !== "Tab") {
      return
    }

    const dialog = dialogRef.current
    if (dialog === null) {
      return
    }

    const focusableElements = [...dialog.querySelectorAll<HTMLElement>(focusableSelector)]
    const firstElement = focusableElements.at(0)
    const lastElement = focusableElements.at(-1)
    if (firstElement === undefined || lastElement === undefined) {
      return
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  const layer = open ? (
    <div className="drawer-layer" data-state="open">
      <button
        aria-label={`Close ${title}`}
        className="drawer-backdrop"
        onClick={() => setOpen(false)}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="drawer"
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
        role="dialog"
      >
        <div className="drawer__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            <p id={descriptionId}>{description}</p>
          </div>
          <button
            className="drawer__close"
            onClick={() => setOpen(false)}
            ref={closeRef}
            type="button"
          >
            Close {title}
          </button>
        </div>
        {children}
      </div>
    </div>
  ) : null

  return (
    <>
      <button onClick={() => setOpen(true)} ref={triggerRef} type="button">
        Open {title}
      </button>
      {layer === null ? null : createPortal(layer, document.body)}
    </>
  )
}
