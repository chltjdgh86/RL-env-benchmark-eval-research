declare module "jest-axe" {
  type AxeViolation = {
    readonly id: string
  }

  type AxeResults = {
    readonly violations: readonly AxeViolation[]
  }

  export function axe(html: Element | string): Promise<AxeResults>
}
