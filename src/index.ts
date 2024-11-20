import * as css from 'css'
import cssWhat from 'css-what'

function combine<T extends Record<string, any>>(list: T[]) {
   const result: T[] = []
   for (const item of list) {
      if (item?.type === 'attribute' || item.type === 'tag') {
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
   if (rule?.type === 'attribute' && regexp.test(rule.value)) {
      return false
   }

   return true;
}

function isMatchPrefixClassName(rule: cssWhat.Selector, prefix: string) {
   const regexp = new RegExp(`^${prefix}`)
   if (rule?.type === 'attribute' && rule.name === 'class' && regexp.test(rule.value)) {
      return true
   }

   return false;
}


type IOptions = {
   prefix?: string;
   ignoreCss?: (string | RegExp)[];
   detail?: boolean;
   source?: string;
}

const defaultOptions: IOptions = {
   prefix: '',
   ignoreCss: [],
   detail: false,
   source: ''
}

function filterClass(ignoreCss: (string | RegExp)[]) {
   const cache = new Map();

   return function (selector: string) {
      const hasIgnore = ignoreCss.some(item => {
         if (typeof item === 'string') {
            if (selector === item) {
               return true;
            }
         }
         if (item instanceof RegExp) {
            if (item.test(selector)) {
               return true;
            }
         }

         return false;
      })
      if (cache.has(selector)) {
         return cache.get(selector)
      }
      cache.set(selector, hasIgnore);
      return hasIgnore;
   }
}

function makePositionPath(source: string, position: css.Position) {
   const startLine = position.line;
   const startColumn = position.column;
   return `${source}:${startLine}:${startColumn}`
}


export async function analyzeCssFileContent(content: string, options: IOptions) {
   const { prefix = 'delta-', ignoreCss = [], detail, source = '' } = {
      ...defaultOptions,
      ...options
   };
   const filter = filterClass(ignoreCss);
   const root = await css.parse(content);
   const rules = root.stylesheet?.rules;
   if (!rules) {
      return;
   }
   const result: {
      selector: string;
      path?: string;
      source?: string;
   }[] = [];

   for (const rule of rules) {

      // console.log(rule)
      if (rule.type === 'rule') {
         if (!rule.selectors || !rule.declarations) {
            continue;
         }

         for (const selector of (rule.selectors ?? [])) {
            if (filter(selector)) {
               continue;
            }
            const parsedSelector = cssWhat.parse(selector);

            const expressions: cssWhat.Selector[] = [];

            for (let i = 0, len = parsedSelector[0].length; i < len; i++) {
               expressions.push(parsedSelector[0][i]);
            }

            const needExpressions = combine(expressions);
            const checkExpression = needExpressions.some(item => isMatchPrefixClassName(item, prefix))
            if (expressions?.[0] && !filterPseudoRoot(expressions[0], prefix)) {
               continue;
            }
            if (checkExpression) {
               continue;
            }
            result.push({
               selector: cssWhat.stringify(parsedSelector),
               path: detail && source ? makePositionPath(source, rule.position!.start!) : '',
               source: source,
            })
         }
      }
   }

   const tempCache = new Map();
   const list = result.filter(item => {
      if (tempCache.has(item.selector)) {
         return false;
      }
      tempCache.set(item.selector, true);
      return true;
   })
   return list;
}