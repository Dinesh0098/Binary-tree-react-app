export class Node {
  value: string;
  left: Node | null;
  right: Node | null;
  parentNode: Node | null;
  isSelected: boolean;

  constructor(value: string) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parentNode = null;
    this.isSelected = false;
  }
}

export class BinarySearchTree {
  root: Node | null;
  depth: number;
  constructor() {
    this.root = null;
    this.depth = 0;
  }

  maxDepth = (node: Node) => {
    if (node == null) return 0;
    else {
      let lDepth = 0;
      let rDepth = 0;
      if (node.left) {
        lDepth = this.maxDepth(node.left);
      }
      if (node.right) {
        rDepth = this.maxDepth(node.right);
      }

      if (lDepth > rDepth) {
        this.depth = lDepth + 1;
      } else {
        this.depth = rDepth + 1;
      }

      return this.depth;
    }
  };

  clearPreviousSelection = (node: Node) => {
    if (node == null) return;

    if (node.left) {
      this.clearPreviousSelection(node.left);
    }
    node.isSelected = false;
    if (node.right) {
      this.clearPreviousSelection(node.right);
    }
  };

  activateParents = (node: Node) => {
    if (node === null) return;
    else {
      node.isSelected = true;
      if (node.parentNode) {
        this.activateParents(node.parentNode);
      }
    }
  };

  createCompleteBinaryTreeFromArray = (treeNodes: string[]) => {
    const length = treeNodes.length;

    const traverseAndReplace = (
      root: Node | null,
      currentIndex: number,
      parentNode: Node | null
    ) => {
      if (currentIndex < length && treeNodes[currentIndex]) {
        root = new Node(treeNodes[currentIndex]);

        root.parentNode = parentNode;
        root.left = traverseAndReplace(root.left, 2 * currentIndex + 1, root);
        root.right = traverseAndReplace(root.right, 2 * currentIndex + 2, root);
        root.isSelected = false;
      }
      return root;
    };
    this.root = traverseAndReplace(this.root, 0, null);
  };
}
