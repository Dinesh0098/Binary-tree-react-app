//@ts-nocheck

export interface INode {
  value: string | null;
  left: Node | null;
  right: Node | null;
  parentNode: Node | null;
}

export class Node {
  value: string | null;
  left: Node | null;
  right: Node | null;
  parentNode: Node | null;

  constructor(value: string) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parentNode = null;
  }
}

export class BinarySearchTree {
  root: INode | null;
  constructor() {
    this.root = null;
  }

  maxDepth = (node) => {
    if (node == null) return 0;
    else {
      /* compute the depth of each subtree */
      let lDepth = this.maxDepth(node.left);
      let rDepth = this.maxDepth(node.right);

      /* use the larger one */
      if (lDepth > rDepth) return lDepth + 1;
      else return rDepth + 1;
    }
  };
}

export function createCompleteBinaryTreeFromArray(treeNodes: string[]) {
  const length = treeNodes.length;
  const binaryTree = new BinarySearchTree();
  const traverseAndReplace = (
    root: INode | null,
    i: number,
    parentNode: INode | null
  ) => {
    if (i < length && treeNodes[i]) {
      root = new Node(treeNodes[i]);

      root.parentNode = parentNode;
      root.left = traverseAndReplace(root.left, 2 * i + 1, root);
      root.right = traverseAndReplace(root.right, 2 * i + 2, root);
    }
    return root;
  };
  binaryTree.root = traverseAndReplace(binaryTree.root, 0, null);
  return binaryTree;
}
