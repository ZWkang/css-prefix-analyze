import { assert, it } from 'vitest'
import { analyzeCssFileContent, name } from '../src'
import { case1 } from './test-css-case'

it('simple', async () => {
  // assert.equal(name, 'pkg-name')
  const result = await analyzeCssFileContent(
    case1,
    {
      prefix: 'delta-',
      ignoreCss: []
    }
  )
  assert.equal
})
