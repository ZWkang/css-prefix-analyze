/* eslint-disable no-console */
// const css = require('css')
import * as css from 'css'
import cssWhat from 'css-what'

import postcss from 'postcss'

import { createParser } from 'css-selector-parser'
import { readFile, writeFile } from 'node:fs/promises'

// const ast = css.parse(`#body > .delta + .test { font-size: 12px; } .delta { color: red }`)

// console.log(JSON.stringify(ast))
// const parse = createParser()

// console.log(
//   JSON.stringify(parse('#body > g > #d + .delta, .delta')),
// )

// postcss(`#body > .delta + .test { font-size: 12px; } .delta { color: red }`).process(css, { from})


const text = `#body > .delta + .test { font-size: 12px; }`

function combine<T extends Record<string ,any>>(list: T[]) {
   const result: T[] = []
   // while()
   for(const item of list) {
      if(item?.type === 'attribute') {
         result.push(item);
      } else {
         break;
      }
   }
   return result;
}

function filterPseudoRoot(rule: cssWhat.Selector, prefix: string) {
   // 如果是全局伪类
   if (rule?.type === 'pseudo' && rule.name === 'root') {
      // 过滤掉
      return false;
   }
   const regexp = new RegExp(`^${prefix}`)
   if(rule?.type === 'attribute' && regexp.test(rule.value)) {
      return false
   }

   return true;
}

function isMatchPrefixClassName(rule: cssWhat.Selector, prefix: string) {
   const regexp = new RegExp(`^${prefix}`)
   if(rule?.type === 'attribute' && regexp.test(rule.value)) {
      return true
   }

   return false;
}


type IOptions = {
   prefix?: string;
   ignoreCss: (string | RegExp)[];

}

const defaultOptions: IOptions = {
   prefix: '',
   ignoreCss: []
}


export async function analyzeCssFileContent(content: string, options: IOptions ) {
   const { prefix = 'delta-', ignoreCss = [] } = {
      ...defaultOptions,
      ...options
   };
   const root = await css.parse(content);
   const rules = root.stylesheet?.rules;
   if(!rules) {
      return;
   }
   const result: any[] = [];

   for(const rule of rules) {
      if(rule.type === 'rule') {
         if(!rule.selectors || !rule.declarations) {
            continue;
         }

         // rule.selectors
         for(const selector of (rule.selectors ?? [])) {
            const parsedSelector = cssWhat.parse(selector);
            
            const expressions: cssWhat.Selector[] = [];
            
            for (let i = 0, len = parsedSelector[0].length; i < len; i++) {
               expressions.push(parsedSelector[0][i]);
            }

            const needExpressions = combine(expressions);
            const checkExpression = needExpressions.some(item => isMatchPrefixClassName(item, prefix))
            if(expressions?.[0] && !filterPseudoRoot(expressions[0], prefix)) {
               continue;
            }
            if(checkExpression) {
               continue;
            }

            const text = needExpressions.map( item => item?.value).join(' ')

            if(text === '-1') {
               console.log(selector, parsedSelector)
            }
            result.push(text);
         }
      }
   }

   return Array.from(new Set(result.filter(Boolean)));
}

; (async () => {
   const result = (await readFile('./src/d.css')).toString('utf-8')
   const res = await analyzeCssFileContent(result, {
      prefix: 'delta-',
      ignoreCss: [/CodeMirror/]
   })

   console.log(res?.filter(item => !/CodeMirror|cm-|t-icon/.test(item)));
})()
