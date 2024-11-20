import { readFile } from "fs/promises";
import { analyzeCssFileContent } from "../src";
import path from "node:path";

(async () => {
  const detail = (await readFile('./tdesign-vue-next.css')).toString('utf-8');

  // console.log(detail);
  const result = await analyzeCssFileContent(detail, {
    prefix: 't-',
    ignoreCss: [],
    detail: true,
    source: path.resolve('./tdesign-vue-next.css')
  })

  console.log(result?.map(item => item.selector))
})();