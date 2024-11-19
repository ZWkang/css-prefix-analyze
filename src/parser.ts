import * as css from 'css'

/**
 *
 * @param fileContent
 * @param options
 * @returns
 */
export function parseCssContent(fileContent: string, options: any) {
  return css.parse(fileContent, options ?? {})
}
