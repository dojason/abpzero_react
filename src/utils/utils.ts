import { parse } from 'querystring';
import _ from 'lodash';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};
export function createTree(array: any[], parentIdProperty: string,
  idProperty: string, parentIdValue: number | null, childrenProperty: string,
  fieldMappings: any[]): any {
  const tree: any = [];

  const nodes = _.filter(array, [parentIdProperty, parentIdValue]);

  _.forEach(nodes, node => {
    const newNode = {
      data: node,
    };

    mapFields(node, newNode, fieldMappings);

    newNode[childrenProperty] = createTree(
      array,
      parentIdProperty,
      idProperty,
      node[idProperty],
      childrenProperty,
      fieldMappings,
    );

    tree.push(newNode);
  });

  return tree;
}
function mapFields(node: any, newNode: any, fieldMappings: any): void {
  _.forEach(fieldMappings, fieldMapping => {
    if (!fieldMapping.target) {
      return;
    }

    if (fieldMapping.hasOwnProperty('value')) {
      newNode[fieldMapping.target] = fieldMapping.value;
    } else if (fieldMapping.source) {
      newNode[fieldMapping.target] = node[fieldMapping.source];
    } else if (fieldMapping.targetFunction) {
      newNode[fieldMapping.target] = fieldMapping.targetFunction(node);
    }
  });
}
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
export function loadScript(name: string) {
  return new Promise((resolve, reject) => {
    const script = (document.createElement('script') as any);
    script.type = 'text/javascript';
    script.src = name;

    if (script.readyState) { // IE
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          resolve({ script: name, loaded: true, status: 'Loaded' });
        }
      };
    } else { // Others
      script.onload = () => {
        resolve({ script: name, loaded: true, status: 'Loaded' });
      };
    }

    script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
    document.getElementsByTagName('head')[0].appendChild(script);
  });
}
