import { assert, it } from 'vitest'
import { analyzeCssFileContent } from '../src'
import { case1, case2, case3 } from './test-css-case'

it('simple test case 1', async () => {
  const result = await analyzeCssFileContent(
    case1,
    {
      prefix: 'delta-',
      ignoreCss: []
    }
  )
  assert.equal(result?.length, 0)
})

it('simple test case 2', async () => {
  const result = await analyzeCssFileContent(
    case2,
    {
      prefix: 'delta-',
      ignoreCss: []
    }
  );

  assert.equal(result?.length, 0)
})

it('simple test case 3', async () => {
  const result = await analyzeCssFileContent(
    case3,
    {
      prefix: 'delta-',
      ignoreCss: []
    }
  );

  assert.equal(result?.length, 1);
})