import type { FormEvent, KeyboardEvent, ReactNode } from "react"
import { useId, useRef, useState } from "react"

type SearchFieldProps = {
  readonly disabled?: boolean
  readonly initialValue?: string
  readonly label: string
  readonly onClear?: () => void
  readonly onSubmit: (query: string) => void
  readonly resultStatus?: string
}

export function SearchField({
  disabled = false,
  initialValue = "",
  label,
  onClear,
  onSubmit,
  resultStatus,
}: SearchFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState(initialValue)

  function submitQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedQuery = query.trim().replace(/\s+/gu, " ")
    if (normalizedQuery.length > 0) {
      onSubmit(normalizedQuery)
    }
  }

  function handleEscape(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && query.length > 0) {
      event.preventDefault()
      setQuery("")
    }
  }

  function clearQuery() {
    setQuery("")
    onClear?.()
    inputRef.current?.focus()
  }

  return (
    <search aria-label={label}>
      <form className="search-field" onSubmit={submitQuery}>
        <label className="search-field__label ui-label" htmlFor={inputId}>
          {label}
        </label>
        <input
          disabled={disabled}
          id={inputId}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={handleEscape}
          ref={inputRef}
          type="search"
          value={query}
        />
        {query.length > 0 ? (
          <button disabled={disabled} onClick={clearQuery} type="button">
            Clear search
          </button>
        ) : (
          <button disabled={disabled} type="submit">
            Search
          </button>
        )}
        {resultStatus === undefined ? null : (
          <p aria-live="polite" className="search-field__status evidence-text" role="status">
            {resultStatus}
          </p>
        )}
      </form>
    </search>
  )
}

type FilterTrayProps = {
  readonly activeCount: number
  readonly children: ReactNode
  readonly onClear: () => void
}

export function FilterTray({ activeCount, children, onClear }: FilterTrayProps) {
  const filterLabel = activeCount === 1 ? "1 active filter" : `${activeCount} active filters`

  return (
    <section aria-label="Evidence filters" className="filter-tray">
      <div className="control-row">
        <p aria-live="polite" className="evidence-text" role="status">
          {filterLabel}
        </p>
        {activeCount > 0 ? (
          <button onClick={onClear} type="button">
            Clear all filters
          </button>
        ) : null}
      </div>
      {children}
    </section>
  )
}
