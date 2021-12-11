import * as _ from 'lodash';

export class ArrayToTreeConverter {
  static createTree(array: any[],
    parentIdProperty:string, idProperty:string,
     parentIdValue:number|null, childrenProperty: string, fieldMappings:any[]): any {
        const tree:any = [];

        const nodes = _.filter(array, [parentIdProperty, parentIdValue]);

        _.forEach(nodes, node => {
            const newNode = {
                data: node,
            };

            this.mapFields(node, newNode, fieldMappings);

            newNode[childrenProperty] = this.createTree(
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

   static mapFields(node:any, newNode:any, fieldMappings:any): void {
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
}
